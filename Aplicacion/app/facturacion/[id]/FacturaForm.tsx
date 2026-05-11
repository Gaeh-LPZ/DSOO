"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4;

interface Props {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  rfc: string;
  puntos: number;
  numeroTarjeta: string;
}

export default function FacturaForm({ orderId, customer, ventas }: { orderId: string; customer: Props; ventas: any; }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [modal, setModal] = useState({ open: false, message: "" });

  // Estados del formulario
  const [ticketNum, setTicketNum] = useState(orderId);
  const [rfc, setRfc] = useState(customer.rfc);
  const [tipoPersona, setTipoPersona] = useState("");
  const [regimenFiscal, setRegimenFiscal] = useState("");
  const [usoCfdi, setUsoCfdi] = useState("");
  const [nombre, setNombre] = useState(customer.nombre);
  const [apellidos, setApellidos] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [correo, setCorreo] = useState(customer.email);

  const steps = ["Orden", "Datos fiscales", "Datos personales", "Confirmación"];

  useEffect(() => {
    if (orderId) setTicketNum(orderId);
  }, [orderId]);

  // FUNCIÓN PARA GENERAR EL PDF
  const generarFacturaPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();

    // 1. Encabezado de la Empresa
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("COMPROBANTE FISCAL (CFDI)", 14, 20);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Folio de venta: ${ticketNum}`, 14, 28);
    doc.text(`Fecha de emisión: ${fecha}`, 14, 33);

    // 2. Sección Emisor vs Receptor
    autoTable(doc, {
      startY: 40,
      head: [['EMISOR The Atelier', 'RECEPTOR ']],
      body: [[
        `The Atelier' S.A. DE C.V.\nRFC: MIS123456TX1\nRegimen: General de Ley`,
        `Nombre: ${nombre} ${apellidos}\nRFC: ${rfc}\nUso CFDI: ${usoCfdi}\nRegimen: ${regimenFiscal}\nCódigo Postal: ${codigoPostal}`
      ]],
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 2, lineColor: [200, 200, 200], lineWidth: 0.1 }
    });

    const iva = ventas.total * 0.16;

    // 3. Tabla de Productos
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Descripción', 'Cantidad', 'Precio Unitario', 'Subtotal']],
      body: ventas.productos.map((p: any) => [
        p.nombre,
        p.cantidad,
        `$${p.precio.toFixed(2)}`,
        `$${p.subtotal.toFixed(2)}`,
      ]),
      headStyles: { fillColor: [15, 23, 42] }, // Slate 900
      styles: { fontSize: 8 }
    });

    // 4. Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const rightAlignX = 196; // Margen derecho aproximado

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: $${(ventas.total - iva).toFixed(2)} MXN`, rightAlignX, finalY, { align: "right" });
    doc.text(`IVA (16%): $${iva.toFixed(2)} MXN`, rightAlignX, finalY + 7, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${ventas.total.toFixed(2)} MXN`, rightAlignX, finalY + 14, { align: "right" });

    // Actualiza el finalY para el pie de página para que no choque
    const footerY = finalY + 30;

    // 5. Pie de página decorativo
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text("Este documento es una representación impresa de un CFDI.", 14, finalY + 20);

    // Descarga automática
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Factura_${rfc}_${ticketNum.split("-")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    // esperar un tick para evitar cortar el download
    setTimeout(() => {
      router.push("/perfil");
    }, 500);
  };

  // FUNCIÓN PARA GENERAR EL XML
  const generarFacturaXML = () => {
    const fecha = new Date().toISOString();
    const iva = ventas.total * 0.16;
    const subtotal = ventas.total - iva;

    const conceptos = ventas.productos.map((p: any) => `
        <cfdi:Concepto
            Descripcion="${escaparXML(p.nombre)}"
            Cantidad="${p.cantidad}"
            ValorUnitario="${p.precio.toFixed(2)}"
            Importe="${p.subtotal.toFixed(2)}"
        />`
    ).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <cfdi:Comprobante
          xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
          Version="4.0"
          Fecha="${fecha}"
          SubTotal="${subtotal.toFixed(2)}"
          Total="${ventas.total.toFixed(2)}"
          TipoDeComprobante="I"
          Folio="${ticketNum}">

          <cfdi:Emisor
              Rfc="MIS123456TX1"
              Nombre="The Atelier S.A. DE C.V."
              RegimenFiscal="601"
          />

          <cfdi:Receptor
              Rfc="${escaparXML(rfc)}"
              Nombre="${escaparXML(nombre)} ${escaparXML(apellidos)}"
              DomicilioFiscalReceptor="${codigoPostal}"
              RegimenFiscalReceptor="${regimenFiscal.split("–")[0].trim()}"
              UsoCFDI="${usoCfdi.split("–")[0].trim()}"
          />

          <cfdi:Conceptos>${conceptos}
          </cfdi:Conceptos>

          <cfdi:Impuestos TotalImpuestosTrasladados="${iva.toFixed(2)}">
              <cfdi:Traslados>
                  <cfdi:Traslado
                      Base="${subtotal.toFixed(2)}"
                      Impuesto="002"
                      TipoFactor="Tasa"
                      TasaOCuota="0.160000"
                      Importe="${iva.toFixed(2)}"
                  />
              </cfdi:Traslados>
          </cfdi:Impuestos>

      </cfdi:Comprobante>`;

    // Descarga igual que el PDF
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Factura_${rfc}_${ticketNum.split("-")[0]}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setTimeout(() => {
      router.push("/perfil");
    }, 500);
  };

  // Fuera del componente o como helper
  const escaparXML = (str: string): string => {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const validateStep = () => {
    if (step === 2 && (!rfc || !tipoPersona || !regimenFiscal || !usoCfdi)) {
      setModal({ open: true, message: "Completa los datos fiscales" });
      return false;
    }
    if (step === 3 && (!nombre || !apellidos || !codigoPostal || !correo)) {
      setModal({ open: true, message: "Completa los datos personales" });
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
      {/* Formulario*/}

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Facturación electrónica</h1>
        <p className="text-sm text-gray-500 mt-1">Genera tu CFDI en pocos pasos</p>
      </div>

      {/* STEPPER (Reutiliza tu lógica de steps.map) */}
      <div className="flex items-center mb-8">
        {steps.map((label, i) => {
          const num = (i + 1) as Step;
          return (
            <div key={label} className="flex items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${num <= step ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-400 border"}`}>
                {num < step ? "✓" : num}
              </div>
              <span className={`ml-2 text-xs ${num === step ? "text-gray-900 font-bold" : "text-gray-400"}`}>{label}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-3" />}
            </div>
          );
        })}
      </div>

      {/* RENDERIZADO DE PASOS (1, 2, 3 igual a tu código) */}
      {step === 1 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <p className="text-sm font-medium text-gray-900 mb-3">Orden seleccionada</p>
          <input value={ticketNum} disabled className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 h-10 text-sm" />
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs text-gray-500">RFC *</label>
            <input value={rfc} onChange={(e) => setRfc(e.target.value.toUpperCase())} className="w-full border border-gray-200 rounded-lg px-3 h-10 text-sm" />
          </div>
          <select value={tipoPersona} onChange={(e) => setTipoPersona(e.target.value)} className="border rounded-lg p-2 text-sm">
            <option value="">Tipo Persona</option>
            <option>Persona física</option>
            <option>Persona moral</option>
          </select>
          <select value={regimenFiscal} onChange={(e) => setRegimenFiscal(e.target.value)} className="border rounded-lg p-2 text-sm">
            <option value="">Régimen fiscal</option>
            <option>601 – General de Ley Personas Morales</option>
            <option>612 – Personas Físicas con Actividades</option>
            <option>616 – Sin obligaciones fiscales</option>
            <option>626 – Resico</option>
          </select>
          <div className="col-span-2">
            <select value={usoCfdi} onChange={(e) => setUsoCfdi(e.target.value)} className="w-full border rounded-lg p-2 text-sm">
              <option value="">Uso CFDI</option>
              <option>G01 – Adquisición de mercancias</option>
              <option>G03 – Gastos en general</option>
              <option>I01 – Construcciones</option>
              <option>S01 – Sin efectos fiscales</option>
            </select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border rounded-lg p-2 text-sm" />
          <input placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="border rounded-lg p-2 text-sm" />
          <input placeholder="Código Postal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className="border rounded-lg p-2 text-sm" />
          <input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} className="border rounded-lg p-2 text-sm" />
        </div>
      )}

      {step === 4 && (
        <div className="bg-slate-50 border p-6 rounded-xl text-sm mb-6 space-y-2">
          <p><b>Cliente:</b> {nombre} {apellidos}</p>
          <p><b>RFC:</b> {rfc}</p>
          <p><b>Email:</b> {correo}</p>
          <div className="border-t pt-2 mt-2">
            <p className="font-bold">Total Compra: ${ventas.total.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(s => Math.max(1, s - 1) as Step)} className="text-gray-400 text-sm">Regresar</button>
        <button
          onClick={() => { if (validateStep()) step < 4 ? setStep(s => s + 1 as Step) : setPreviewOpen(true) }}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm"
        >
          {step === 4 ? "Finalizar" : "Continuar"}
        </button>
      </div>

      {/* MODAL PREVIEW */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">¿Todo listo?</h2>
            <p className="text-gray-600 text-sm mb-6">Se generará un archivo PDF con el RFC <b>{rfc}</b> por un monto de <b>${ventas.total.toFixed(2)}</b>.</p>

            <div className="flex gap-4">
              <button onClick={() => setPreviewOpen(false)} className="flex-1 py-2 border rounded-xl text-sm">Cancelar</button>
              <button
                onClick={() => {
                  generarFacturaPDF();
                  setPreviewOpen(false);
                  router.push("/perfil");
                }}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold"
              >
                Descargar en PDF
              </button>

              <button
                onClick={() => {
                  generarFacturaXML();
                  setPreviewOpen(false);
                  router.push("/perfil");
                }}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold"
              >
                Descargar en XML
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}