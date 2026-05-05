"use client";

import { useState } from "react";
import { updateCustomerAction } from "@/modules/customer/customer.actions";

interface PerfilFormProps {
    initialData: {
        nombre: string;
        email: string;
        telefono: string;
        fechaNacimiento: string;
        rfc: string;
        puntos: number;        
        numeroTarjeta: string; 
    };
}

export default function PerfilForm({ initialData }: PerfilFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setMessage(null);

        const data = Object.fromEntries(formData);
        const result = await updateCustomerAction(data);

        setLoading(false);

        if (result.success) {
            setMessage({ type: "success", text: "¡Datos actualizados correctamente!" });
            setIsEditing(false);
        } else {
            setMessage({ type: "error", text: result.message || "Ocurrió un error al actualizar" });
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Información Personal</h2>
                <button
                    type="button"
                    onClick={() => { setIsEditing(!isEditing); setMessage(null); }}
                    className="text-sm font-medium text-slate-900 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50"
                >
                    {isEditing ? "Cancelar" : "Editar Datos"}
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Nombre Completo</label>
                    {isEditing ? (
                        <input name="name" defaultValue={initialData.nombre}
                            className="w-full border-b border-slate-300 py-2 focus:border-slate-900 outline-none" required />
                    ) : (
                        <p className="text-slate-900 font-medium py-2 border-b border-slate-200">{initialData.nombre}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Correo Electrónico</label>
                    <p className="text-slate-400 font-medium py-2 border-b border-slate-200 bg-slate-50/50">{initialData.email}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Teléfono</label>
                    {isEditing ? (
                        <input name="phone" defaultValue={initialData.telefono}
                            className="w-full border-b border-slate-300 py-2 focus:border-slate-900 outline-none" />
                    ) : (
                        <p className="text-slate-900 font-medium py-2 border-b border-slate-200">{initialData.telefono || "No registrado"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Fecha de Nacimiento</label>
                    {isEditing ? (
                        <input name="birthDate" type="date" defaultValue={initialData.fechaNacimiento}
                            className="w-full border-b border-slate-300 py-2 focus:border-slate-900 outline-none" />
                    ) : (
                        <p className="text-slate-900 font-medium py-2 border-b border-slate-200">{initialData.fechaNacimiento || "No registrado"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">RFC</label>
                    {isEditing ? (
                        <input name="rfc" defaultValue={initialData.rfc}
                            className="w-full border-b border-slate-300 py-2 focus:border-slate-900 outline-none" />
                    ) : (
                        <p className="text-slate-900 font-medium py-2 border-b border-slate-200">{initialData.rfc || "No registrado"}</p>
                    )}
                </div>

                {isEditing && (
                    <div className="md:col-span-2 mt-4">
                        <button type="submit" disabled={loading}
                            className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-opacity">
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}