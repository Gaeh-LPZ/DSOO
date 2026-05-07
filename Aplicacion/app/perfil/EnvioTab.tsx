"use client"
import { useState } from "react";
import { getShipmentBySaleIdAction } from "@/modules/shipment/shipment.actions";
import { getSaleWithItemsAction } from "@/modules/sale/sale.actions";

const statusLabel: Record<string, string> = {
    PENDING: "Confirmado",
    IN_TRANSIT: "En preparación",
    DELIVERED: "Entregado",
};

const statusIcon: Record<string, string> = {
    PENDING: "inventory_2",
    IN_TRANSIT: "local_shipping",
    DELIVERED: "check_circle",
};

const statusColor: Record<string, string> = {
    PENDING: "text-yellow-600",
    IN_TRANSIT: "text-blue-600",
    DELIVERED: "text-green-600",
};

export default function EnvioTab({ saleIds }: { saleIds: string[] }) {
    const [busqueda, setBusqueda] = useState("");
    const [envio, setEnvio] = useState<any>(null);
    const [venta, setVenta] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const buscar = async () => {
        if (!busqueda.trim()) return;
        setLoading(true);
        setError(null);
        setEnvio(null);
        setVenta(null);

        const [resEnvio, resVenta] = await Promise.all([
            getShipmentBySaleIdAction(busqueda.trim()),
            getSaleWithItemsAction(busqueda.trim())
        ]);

        if (!resEnvio.success || !resEnvio.data) {
            setError("No se encontró un envío con ese número de pedido.");
        } else {
            setEnvio(resEnvio.data);
            if (resVenta.success) setVenta(resVenta.data);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-serif mb-2">Seguimiento de Pedido</h2>
            <p className="text-slate-500 text-sm mb-6">Ingresa el número de tu pedido para ver el estado de tu envío.</p>

            <div className="flex gap-3 mb-8">
                <input
                    type="text"
                    placeholder="ID de tu pedido"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && buscar()}
                    className="border-b border-slate-300 bg-transparent text-sm px-2 py-2 flex-1 focus:outline-none focus:border-slate-700"
                />
                <button
                    onClick={buscar}
                    disabled={loading}
                    className="bg-slate-900 text-white text-sm px-6 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                >
                    {loading ? "Buscando..." : "Buscar"}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {envio && (
                <div className="flex flex-col gap-4">
                    {/* Estado */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`material-symbols-outlined text-4xl ${statusColor[envio.status]}`}>
                                {statusIcon[envio.status]}
                            </span>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-widest">Estado actual</p>
                                <p className={`text-xl font-semibold ${statusColor[envio.status]}`}>
                                    {statusLabel[envio.status]}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-slate-600 mb-6">
                            <p><span className="font-medium text-slate-800">ID Pedido:</span> {envio.saleId}</p>
                            <p><span className="font-medium text-slate-800">Número de rastreo:</span> {envio.tracking ?? "Sin asignar aún"}</p>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-2">
                            {["PENDING", "IN_TRANSIT", "DELIVERED"].map((s, i) => {
                                const pasos = ["PENDING", "IN_TRANSIT", "DELIVERED"];
                                const activo = pasos.indexOf(envio.status) >= i;
                                return (
                                    <div key={s} className="flex items-center gap-2 flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                            ${activo ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-400"}`}>
                                            {i + 1}
                                        </div>
                                        <p className="text-xs text-slate-500 hidden sm:block">{statusLabel[s]}</p>
                                        {i < 2 && <div className={`flex-1 h-px ${activo ? "bg-slate-900" : "bg-slate-200"}`} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Productos */}
                    {venta && venta.items.length > 0 && (
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-800 mb-4">Productos incluidos</h3>
                            <div className="flex flex-col gap-3">
                                {venta.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <div>
                                            <p className="text-slate-700 font-medium">Producto #{item.productId.slice(0, 8)}...</p>
                                            <p className="text-slate-400 text-xs">Cantidad: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-slate-800">${item.subtotal.toFixed(2)}</p>
                                    </div>
                                ))}
                                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2">
                                    <p>Total</p>
                                    <p>${venta.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}