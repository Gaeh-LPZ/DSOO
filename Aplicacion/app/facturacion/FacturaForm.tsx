"use client";

import { useState } from "react";

type Step = 1 | 2 | 3 | 4;

export default function FacturaForm() {
  const [step, setStep] = useState<Step>(1);

  // Paso 1
  const [ticketNum, setTicketNum] = useState("");

  // Paso 2
  const [rfc, setRfc] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [regimenFiscal, setRegimenFiscal] = useState("");
  const [usoCfdi, setUsoCfdi] = useState("");

  // Paso 3
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [correo, setCorreo] = useState("");

  const steps = ["Ticket", "Datos fiscales", "Datos personales", "Confirmación"];

  return (
    <div className="font-sans py-6">

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900">
          Solicitar factura electrónica
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Ingresa los datos de tu compra para generar tu CFDI
        </p>
      </div>

      {/* Indicador de pasos */}
      <div className="flex items-center mb-8">
        {steps.map((label, i) => {
          const num = (i + 1) as Step;
          const isDone = num < step;
          const isActive = num === step;
          return (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
                    ${isDone ? "bg-green-600 text-white" : ""}
                    ${isActive ? "bg-blue-500 text-white" : ""}
                    ${!isDone && !isActive ? "bg-gray-100 text-gray-400 border border-gray-200" : ""}
                  `}
                >
                  {isDone ? "✓" : num}
                </div>
                <span className={`text-sm font-medium whitespace-nowrap ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mx-3 w-8" />
              )}
            </div>
          );
        })}
      </div>

      {/* Aviso */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex gap-3 mb-5">
        <span className="text-blue-500 text-lg">ℹ</span>
        <p className="text-sm text-gray-500 leading-relaxed">
          Solo puedes facturar tickets del mes en curso. Todos los campos
          marcados con <span className="text-red-500">*</span> son obligatorios.
        </p>
      </div>

      {/* ── PASO 1: Ticket ── */}
      {step === 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <p className="text-sm font-medium text-gray-900 mb-4">🧾 Datos del ticket</p>

          <div className="flex gap-3 items-end">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-500">
                Número de ticket <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ticketNum}
                onChange={(e) => setTicketNum(e.target.value)}
                placeholder="Ej. 00123456"
                className="border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="h-9 px-4 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 whitespace-nowrap">
              🔍 Buscar
            </button>
          </div>
        </div>
      )}

      {/* ── PASO 2: Datos fiscales ── */}
      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <p className="text-sm font-medium text-gray-900 mb-4">🏢 Datos fiscales</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs text-gray-500">RFC <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={rfc}
                onChange={(e) => setRfc(e.target.value.toUpperCase())}
                placeholder="Ej. XAXX010101000"
                className="border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Tipo de persona <span className="text-red-500">*</span></label>
              <select
                value={tipoPersona}
                onChange={(e) => setTipoPersona(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option>Persona física</option>
                <option>Persona moral</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Régimen fiscal <span className="text-red-500">*</span></label>
              <select
                value={regimenFiscal}
                onChange={(e) => setRegimenFiscal(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option>601 – General de Ley Personas Morales</option>
                <option>612 – Personas Físicas con Actividades</option>
                <option>616 – Sin obligaciones fiscales</option>
                <option>626 – Resico</option>
              </select>
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs text-gray-500">Uso de CFDI <span className="text-red-500">*</span></label>
              <select
                value={usoCfdi}
                onChange={(e) => setUsoCfdi(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option>G01 – Adquisición de mercancias</option>
                <option>G03 – Gastos en general</option>
                <option>I01 – Construcciones</option>
                <option>S01 – Sin efectos fiscales</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 3: Datos personales ── */}
      {step === 3 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <p className="text-sm font-medium text-gray-900 mb-4">👤 Datos personales</p>

          <div className="grid grid-cols-2 gap-3">

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Juan"
                className="border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Ej. García López"
                className="border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                Código postal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                placeholder="Ej. 06600"
                maxLength={5}
                className="border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Ej. correo@ejemplo.com"
                className="border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>
        </div>
      )}

      {/* ── PASO 4: Confirmación ── */}
      {step === 4 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <p className="text-sm font-medium text-gray-900 mb-4">✅ Confirmación</p>

          <div className="space-y-3 text-sm text-gray-700">

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Ticket</span>
              <span className="font-medium">{ticketNum}</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">RFC</span>
              <span className="font-medium">{rfc}</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Tipo de persona</span>
              <span className="font-medium">{tipoPersona}</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Régimen fiscal</span>
              <span className="font-medium">{regimenFiscal}</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Uso de CFDI</span>
              <span className="font-medium">{usoCfdi}</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Nombre completo</span>
              <span className="font-medium">{nombre} {apellidos}</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Código postal</span>
              <span className="font-medium">{codigoPostal}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Correo electrónico</span>
              <span className="font-medium">{correo}</span>
            </div>

          </div>

          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-600">
            Al confirmar, recibirás tu factura en formato XML y PDF al correo registrado.
          </div>
        </div>
      )}

      {/* Footer de acciones */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setStep((prev) => Math.max(prev - 1, 1) as Step)}
          className="text-sm text-gray-400 hover:text-gray-700"
        >
          {step === 1 ? "✕ Cancelar" : "← Regresar"}
        </button>

        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-400">Paso {step} de 4</span>
          <button
            onClick={() => setStep((prev) => Math.min(prev + 1, 4) as Step)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-6 h-9 rounded-lg flex items-center gap-2"
          >
            {step === 4 ? "Generar factura ✓" : "Continuar →"}
          </button>
        </div>
      </div>

    </div>
  );
}