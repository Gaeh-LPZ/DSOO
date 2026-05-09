// components/NuevoRolModal.tsx
"use client";
import { useEffect, useState } from "react";
import { createRoleAction, getPermissionsAction } from "@/modules/user/user.actions";

interface PermissionOption {
    id: string;
    name: string;
}

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function NuevoRolModal({ onClose, onSuccess }: Props) {
    const [permissions, setPermissions]   = useState<PermissionOption[]>([]);
    const [nombre, setNombre]             = useState("");
    const [descripcion, setDescripcion]   = useState("");
    const [selected, setSelected]         = useState<string[]>([]);
    const [nuevoPermiso, setNuevoPermiso] = useState("");
    const [errors, setErrors]             = useState<Record<string, string>>({});
    const [loading, setLoading]           = useState(false);

    useEffect(() => {
        getPermissionsAction().then(setPermissions);
    }, []);

    function togglePermiso(name: string) {
        setSelected(prev =>
            prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
        );
    }

    function agregarNuevoPermiso() {
        const trimmed = nuevoPermiso.trim().toUpperCase();
        if (!trimmed) return;
        if (selected.includes(trimmed)) return;
        setSelected(prev => [...prev, trimmed]);
        setNuevoPermiso("");
    }

    function validate() {
        const e: Record<string, string> = {};
        if (!nombre.trim())        e.nombre = "El nombre del rol es requerido";
        if (selected.length === 0) e.perms  = "Agrega al menos un permiso";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setLoading(true);
        try {
            await createRoleAction({
                name:        nombre.trim().toUpperCase(),
                description: descripcion.trim(),
                permissions: selected,
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setErrors({ submit: err.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-100 shadow-2xl w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">

                {/* Header */}
                <div className="flex justify-between items-start p-8 pb-6 border-b border-slate-50">
                    <div>
                        <h2 className="font-serif text-2xl text-slate-900">Nuevo Rol</h2>
                        <p className="text-xs text-slate-400 mt-1 tracking-wide">Define nombre, descripción y permisos</p>
                    </div>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-5">

                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Nombre del rol</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Ej. SUPERVISOR"
                            className={`w-full px-4 py-2.5 border bg-slate-50 text-sm text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all uppercase placeholder:normal-case ${errors.nombre ? "border-rose-400" : "border-slate-200"}`}
                        />
                        {errors.nombre && <p className="text-[11px] text-rose-500">{errors.nombre}</p>}
                    </div>

                    {/* Descripción */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Descripción <span className="normal-case text-slate-300">(opcional)</span></label>
                        <input
                            type="text"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            placeholder="Ej. Puede registrar ventas y ver reportes"
                            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 text-sm outline-none focus:border-slate-900 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="border-t border-slate-50 pt-1" />

                    {/* Permisos */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">
                            Permisos
                        </label>

                        {/* Permisos existentes en BD */}
                        {permissions.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {permissions.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => togglePermiso(p.name)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase border transition-all ${
                                            selected.includes(p.name)
                                                ? "bg-slate-900 text-white border-slate-900"
                                                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-400"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>
                                            {selected.includes(p.name) ? "check" : "add"}
                                        </span>
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Agregar permiso nuevo */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={nuevoPermiso}
                                onChange={e => setNuevoPermiso(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && agregarNuevoPermiso()}
                                placeholder="Agregar permiso nuevo..."
                                className="flex-1 px-3 py-2 border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-700 outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300 uppercase placeholder:normal-case"
                            />
                            <button
                                type="button"
                                onClick={agregarNuevoPermiso}
                                className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
                            </button>
                        </div>

                        {/* Permisos seleccionados */}
                        {selected.length > 0 && (
                            <div className="space-y-1.5">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Seleccionados</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {selected.map(p => (
                                        <span
                                            key={p}
                                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-semibold tracking-wider uppercase"
                                        >
                                            {p}
                                            <button
                                                type="button"
                                                onClick={() => setSelected(prev => prev.filter(s => s !== p))}
                                                className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: "11px" }}>close</span>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {errors.perms && <p className="text-[11px] text-rose-500">{errors.perms}</p>}
                    </div>

                    {errors.submit && (
                        <p className="text-[11px] text-rose-500 bg-rose-50 border border-rose-200 px-3 py-2">
                            {errors.submit}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-8 pb-8">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-xs font-medium text-slate-500 border border-slate-200 hover:border-slate-400 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-xs font-semibold tracking-widest uppercase hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>shield_person</span>
                        {loading ? "Creando..." : "Crear rol"}
                    </button>
                </div>

            </div>
        </div>
    );
}