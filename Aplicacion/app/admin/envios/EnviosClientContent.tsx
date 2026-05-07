"use client"
import { useState } from "react";
import { dispatchShipmentAction, deliverShipmentAction } from "@/modules/shipment/shipment.actions";

interface Shipment {
    id: string;
    saleId: string;
    status: string;
    tracking: string | null;
}

interface Props {
    envios: Shipment[];
}

const statusLabel: Record<string, string> = {
    PENDING: "Pendiente",
    IN_TRANSIT: "En tránsito",
    DELIVERED: "Entregado",
};

const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_TRANSIT: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-800",
};

export default function EnviosClientContent({ envios }: Props) {
    const [lista, setLista] = useState<Shipment[]>(envios);
    const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

    const mostrarMensaje = (tipo: "ok" | "error", texto: string) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje(null), 3000);
    };

    const handleDispatch = async (shipmentId: string) => {
        setLoading(shipmentId);
        const tracking = trackingInputs[shipmentId] || undefined;
        const res = await dispatchShipmentAction({ shipmentId, tracking });
        if (!res.success) {
            mostrarMensaje("error", (res as any).message);
        } else {
            setLista(prev => prev.map(e => e.id === shipmentId ? { ...e, status: "IN_TRANSIT", tracking: tracking ?? e.tracking } : e));
            mostrarMensaje("ok", "Envío marcado como en tránsito.");
        }
        setLoading(null);
    };

    const handleDeliver = async (shipmentId: string) => {
        setLoading(shipmentId);
        const res = await deliverShipmentAction({ shipmentId });
        if (!res.success) {
            mostrarMensaje("error", (res as any).message);
        } else {
            setLista(prev => prev.map(e => e.id === shipmentId ? { ...e, status: "DELIVERED" } : e));
            mostrarMensaje("ok", "Envío marcado como entregado.");
        }
        setLoading(null);
    };

    return (
        <div>
            {mensaje && (
                <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${mensaje.tipo === "ok" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {mensaje.texto}
                </div>
            )}

            {lista.length === 0 ? (
                <div className="text-center py-20 text-slate-400">No hay envíos registrados.</div>
            ) : (
                <div className="flex flex-col gap-4">
                    {lista.map((envio) => (
                        <div key={envio.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">ID Venta</p>
                                    <p className="font-mono text-sm text-slate-700">{envio.saleId}</p>
                                    <p className="text-xs text-slate-400 mt-2">Tracking: <span className="text-slate-600">{envio.tracking ?? "Sin asignar"}</span></p>
                                </div>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[envio.status]}`}>
                                    {statusLabel[envio.status]}
                                </span>
                            </div>

                            {envio.status === "PENDING" && (
                                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        placeholder="Número de tracking (opcional)"
                                        value={trackingInputs[envio.id] ?? ""}
                                        onChange={e => setTrackingInputs(prev => ({ ...prev, [envio.id]: e.target.value }))}
                                        className="border-b border-slate-300 bg-transparent text-sm px-2 py-1 flex-1 focus:outline-none focus:border-slate-700"
                                    />
                                    <button
                                        onClick={() => handleDispatch(envio.id)}
                                        disabled={loading === envio.id}
                                        className="bg-slate-800 text-white text-sm px-5 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                                    >
                                        {loading === envio.id ? "Procesando..." : "Marcar En Tránsito"}
                                    </button>
                                </div>
                            )}

                            {envio.status === "IN_TRANSIT" && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleDeliver(envio.id)}
                                        disabled={loading === envio.id}
                                        className="bg-green-700 text-white text-sm px-5 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                                    >
                                        {loading === envio.id ? "Procesando..." : "Registrar Entrega"}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}