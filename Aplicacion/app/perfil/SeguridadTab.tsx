"use client";

import { updatePasswordAction } from "@/modules/customer/customer.actions";
import { useState } from "react";

interface Props {
    id: string;
}

export default function SeguridadTab({ id }: Props) {
    const [actual, setActual] = useState("");
    const [nueva, setNueva] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [error, setError] = useState("");
    const [exito, setExito] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError("");
        setExito(false);

        if (!actual || !nueva || !confirmar) {
            setError("Completa todos los campos");
            return;
        }
        if (nueva.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        if (nueva !== confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            await updatePasswordAction({ customerId: id, password: actual, newpassword: nueva });
            setExito(true);
            setActual("");
            setNueva("");
            setConfirmar("");
        } catch (e: any) {
            setError(e.message || "Error al cambiar contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Seguridad</h2>
            <p className="text-sm text-slate-500 mb-8">Actualiza tu contraseña de acceso</p>

            <div className="space-y-4">

                {/* Contraseña actual */}
                <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Contraseña actual
                    </label>
                    <input
                        type="password"
                        value={actual}
                        onChange={(e) => setActual(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1 w-full border border-slate-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>

                <div className="h-px bg-slate-100" />

                {/* Nueva contraseña */}
                <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Nueva contraseña
                    </label>
                    <input
                        type="password"
                        value={nueva}
                        onChange={(e) => setNueva(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1 w-full border border-slate-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {/* Indicador de fuerza */}
                    {nueva && (
                        <div className="mt-2 flex gap-1">
                            {[1, 2, 3, 4].map((nivel) => (
                                <div
                                    key={nivel}
                                    className={`h-1 flex-1 rounded-full transition-colors ${
                                        nivel <= calcularFuerza(nueva)
                                            ? fuerzaColor(calcularFuerza(nueva))
                                            : "bg-slate-100"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Confirmar contraseña */}
                <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Confirmar contraseña
                    </label>
                    <input
                        type="password"
                        value={confirmar}
                        onChange={(e) => setConfirmar(e.target.value)}
                        placeholder="••••••••"
                        className={`mt-1 w-full border rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                            confirmar && nueva !== confirmar
                                ? "border-red-300 bg-red-50"
                                : "border-slate-200"
                        }`}
                    />
                    {confirmar && nueva !== confirmar && (
                        <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                    )}
                    {confirmar && nueva === confirmar && (
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Las contraseñas coinciden
                        </p>
                    )}
                </div>

                {/* Error general */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Éxito */}
                {exito && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Contraseña actualizada correctamente
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading || (!!confirmar && nueva !== confirmar)}
                    className="w-full bg-slate-900 text-white rounded-xl h-11 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                    {loading ? "Guardando..." : "Guardar contraseña"}
                </button>
            </div>
        </div>
    );
}

// Helpers fuera del componente
function calcularFuerza(password: string): number {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}

function fuerzaColor(score: number): string {
    if (score <= 1) return "bg-red-400";
    if (score === 2) return "bg-orange-400";
    if (score === 3) return "bg-yellow-400";
    return "bg-emerald-500";
}