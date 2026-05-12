"use client";

import { useEffect, useState } from "react";
import { getSalesByCustomerAction, cancelSaleAction } from "@/modules/sale/sale.actions";
import { useRouter } from "next/navigation";

interface SaleItemData {
    id: string;
    productId: string;
    name: string;
    imageUrl: string | null;
    quantity: number;
    price: number;
}

interface ShipmentData {
    status: "PENDING" | "IN_TRANSIT" | "DELIVERED";
    tracking: string | null;
}

interface PedidoData {
    id: string;
    total: number;
    status: "PENDING" | "PAID" | "CANCELLED" | "CREDIT";
    createdAt: string;
    items: SaleItemData[];
    shipment: ShipmentData | null;
}

const saleStatusLabel: Record<string, string> = {
    PENDING: "Pendiente de pago",
    PAID: "Pagado",
    CANCELLED: "Cancelado",
    CREDIT: "A crédito",
};

const saleStatusColor: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    CREDIT: "bg-blue-50 text-blue-700 border-blue-200",
};

const shipmentLabel: Record<string, string> = {
    PENDING: "Confirmado",
    IN_TRANSIT: "En camino",
    DELIVERED: "Entregado",
};

const shipmentIcon: Record<string, string> = {
    PENDING: "inventory_2",
    IN_TRANSIT: "local_shipping",
    DELIVERED: "check_circle",
};

interface Props {
    customerId: string;
    onVerEnvio: (saleId: string) => void;
}

export default function PedidosTab({ customerId, onVerEnvio }: Props) {
    const [pedidos, setPedidos] = useState<PedidoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandido, setExpandido] = useState<string | null>(null);

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getSalesByCustomerAction(customerId);
                if (!res.success || !res.data) throw new Error(res.error);
                setPedidos(res.data);
            } catch {
                setError("No se pudieron cargar tus pedidos.");
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [customerId]);

    const handlePedidoCancelado = (saleId: string) => {
        setPedidos(prev => prev.map(p => p.id === saleId ? { ...p, status: "CANCELLED" } : p));
    };

    if (loading) return <PedidosSkeleton />;
    if (error) return <ErrorBox mensaje={error} />;
    const pedidosActivos = pedidos.filter(p => p.status !== "CANCELLED");
    if (pedidosActivos.length === 0) return <Vacio />;

    return (
        <div>
            <h2 className="text-2xl font-serif mb-1">Mis Pedidos</h2>
            <p className="text-slate-500 text-sm mb-6">
                Historial completo de tus compras en Atelier.
            </p>

            <div className="flex flex-col gap-3">
                {pedidos
                    .filter(pedido => pedido.status !== "CANCELLED")
                    .map(pedido => (
                        <TarjetaPedido
                            key={pedido.id}
                            pedido={pedido}
                            expandido={expandido === pedido.id}
                            onToggle={() =>
                                setExpandido(prev => prev === pedido.id ? null : pedido.id)
                            }
                            onVerEnvio={onVerEnvio}
                            onCancelado={handlePedidoCancelado}
                        />
                    ))
                }
            </div>
        </div>
    );
}

function TarjetaPedido({ pedido, expandido, onToggle, onVerEnvio, onCancelado}: { pedido: PedidoData; expandido: boolean; onToggle: () => void; onVerEnvio: (saleId: string) => void; onCancelado: (saleId: string) => void;}) {
    const { shipment } = pedido;
    const entregado = shipment?.status === "DELIVERED";
    const router = useRouter();
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancelar = async () => {
        if (!window.confirm("¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.")) return;
        
        setIsCancelling(true);
        const res = await cancelSaleAction(pedido.id);
        setIsCancelling(false);

        if (res.success) {
            onCancelado(pedido.id);
        } else {
            alert(res.error || "Hubo un error al cancelar el pedido.");
        }
    };
    
    const fecha = new Date(pedido.createdAt).toLocaleDateString("es-MX", {
        day: "2-digit", month: "short", year: "numeric",
    });

    const totalItems = pedido.items.reduce((s, i) => s + i.quantity, 0);

    return (
        <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">

            {/* ── Cabecera ── */}
            <div className="flex items-center gap-4 px-5 py-4">

                {/* Icono */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                    ${entregado
                        ? "bg-emerald-100 text-emerald-600"
                        : shipment
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-400"
                    }`}>
                    <span className="material-symbols-outlined text-xl">
                        {shipment ? shipmentIcon[shipment.status] : "receipt_long"}
                    </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800 font-mono">
                            #{pedido.id.slice(0, 8).toUpperCase()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${saleStatusColor[pedido.status]}`}>
                            {saleStatusLabel[pedido.status]}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {fecha} · {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
                    </p>
                </div>

                {/* Total */}
                <p className="text-sm font-bold text-slate-900 flex-shrink-0 hidden sm:block">
                    ${pedido.total.toFixed(2)}
                </p>

                {/* Botón estado envío */}
                <div className="flex-shrink-0">
                    {entregado ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full select-none">
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check_circle</span>
                            Entregado
                        </span>
                    ) : shipment ? (
                        <button
                            onClick={() => onVerEnvio(pedido.id)}
                            className="inline-flex items-center gap-1.5 border border-slate-800 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                {shipmentIcon[shipment.status]}
                            </span>
                            {shipmentLabel[shipment.status]}
                        </button>
                    ) : (
                        <span className="text-xs text-slate-400 italic px-2">Sin envío</span>
                    )}
                </div>

                {/* Chevron */}
                <button
                    onClick={onToggle}
                    className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 ml-1"
                    aria-label="Ver detalle"
                >
                    <span
                        className="material-symbols-outlined transition-transform duration-200"
                        style={{ transform: expandido ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                        expand_more
                    </span>
                </button>
            </div>

            {/* ── Detalle expandible ── */}
            {expandido && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                        Artículos
                    </p>

                    <div className="flex flex-col gap-2 mb-4">
                        {pedido.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center">

                                        {item.imageUrl ? <img
                                            src={item.imageUrl || "/placeholder.png"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                            : <span className="text-slate-500" style={{ fontSize: "14px" }}>
                                                {item.imageUrl}
                                            </span>
                                        }

                                    </div>
                                    <span className="text-slate-600 font-mono text-xs">
                                        {item.name}…
                                    </span>
                                    <span className="text-slate-400 text-xs">× {item.quantity}</span>
                                </div>
                                <span className="text-slate-800 font-medium">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total en móvil */}
                    <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-3 sm:hidden">
                        <span>Total</span>
                        <span>${pedido.total.toFixed(2)}</span>
                    </div>

                    {/* Rastreo */}
                    {shipment && (
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                    local_shipping
                                </span>
                                Rastreo:{" "}
                                <span className="font-mono text-slate-700">
                                    {shipment.tracking ?? "Sin número asignado"}
                                </span>
                            </div>
                            {!entregado && (
                                <button
                                    onClick={() => onVerEnvio(pedido.id)}
                                    className="text-xs text-slate-700 underline underline-offset-2 hover:text-slate-900"
                                >
                                    Seguir envío →
                                </button>
                            )}
                        </div>
                    )}

                    <div className="mt-3 flex justify-end">
                        {!entregado && (
                            <button
                                onClick={handleCancelar}
                                disabled={isCancelling}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full 
                                    border border-red-200 text-red-600 
                                    hover:bg-red-50 hover:border-red-300
                                    transition-all duration-200 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                    cancel
                                </span>
                                {isCancelling ? "Cancelando..." : "Cancelar Pedido"}
                            </button>
                        )}
                        
                        {/* Factura */}
                        <button
                            onClick={() => router.push(`/facturacion/${pedido.id}`)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full 
                                border border-slate-300 text-slate-700 
                                hover:bg-slate-900 hover:text-white hover:border-slate-900
                                transition-all duration-200"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                receipt_long
                            </span>
                            Factura Electronica
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function PedidosSkeleton() {
    return (
        <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-6 w-40 bg-slate-200 rounded mb-2" />
            {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
            ))}
        </div>
    );
}

function ErrorBox({ mensaje }: { mensaje: string }) {
    return (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{mensaje}</div>
    );
}

function Vacio() {
    return (
        <div className="text-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 block">receipt_long</span>
            <p className="text-sm">Aún no tienes pedidos registrados.</p>
        </div>
    );
}