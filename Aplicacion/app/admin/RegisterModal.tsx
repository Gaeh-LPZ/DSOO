"use client";
import { useEffect, useState } from "react";
import { getRolesAction, registerAction } from "@/modules/user/user.actions";

interface RoleOption {
    id: string;
    name: string;
}

const ROLE_ICONS: Record<string, string> = {
    Admin:   "shield_person",
    CAJERO:  "point_of_sale",
    ALMACEN: "inventory_2",
    ENVIOS:  "local_shipping",
};

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function NuevoUsuarioModal({ onClose, onSuccess }: Props) {
    const [roles, setRoles]         = useState<RoleOption[]>([]);
    const [nombre, setNombre]       = useState("");
    const [email, setEmail]         = useState("");
    const [password, setPassword]   = useState("");
    const [rol, setRol]             = useState<string | null>(null);
    const [showPass, setShowPass]   = useState(false);
    const [errors, setErrors]       = useState<Record<string, string>>({});
    const [loading, setLoading]     = useState(false);

    useEffect(() => {
        getRolesAction().then(setRoles);
    }, []);

    function validate() {
        const e: Record<string, string> = {};
        if (!nombre.trim())      e.nombre   = "El nombre es requerido";
        if (!email.trim())       e.email    = "El correo es requerido";
        if (password.length < 6) e.password = "Mínimo 6 caracteres";
        if (!rol)                e.rol      = "Selecciona un rol";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setLoading(true);
        try {
            await registerAction({
                name:     nombre.trim(),
                email:    email.trim() + "@luxury.com",
                password,
                role:     rol!,
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
                        <h2 className="font-serif text-2xl text-slate-900">Nuevo Usuario</h2>
                        <p className="text-xs text-slate-400 mt-1 tracking-wide">Completa los datos para crear una cuenta</p>
                    </div>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-5">

                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Nombre completo</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Ej. María García"
                            className={`w-full px-4 py-2.5 border bg-slate-50 text-sm text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all ${errors.nombre ? "border-rose-400" : "border-slate-200"}`}
                        />
                        {errors.nombre && <p className="text-[11px] text-rose-500">{errors.nombre}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Correo electrónico</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="nombre.apellido"
                                className={`flex-1 px-4 py-2.5 border-y border-l bg-slate-50 text-sm outline-none focus:border-slate-900 focus:bg-white transition-all ${errors.email ? "border-rose-400" : "border-slate-200"}`}
                            />
                            <span className="px-3 flex items-center bg-slate-100 border border-slate-200 text-xs text-slate-500 font-medium whitespace-nowrap">
                                @luxury.com
                            </span>
                        </div>
                        {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                className={`w-full px-4 py-2.5 pr-10 border bg-slate-50 text-sm outline-none focus:border-slate-900 focus:bg-white transition-all ${errors.password ? "border-rose-400" : "border-slate-200"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {showPass ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                        {errors.password && <p className="text-[11px] text-rose-500">{errors.password}</p>}
                    </div>

                    <div className="border-t border-slate-50 pt-1" />

                    {/* Rol */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">
                            Rol del usuario
                        </label>

                        {roles.length === 0 ? (
                            <p className="text-[11px] text-slate-400">Cargando roles...</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {roles.map(r => (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => setRol(r.name)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase border transition-all ${
                                            rol === r.name
                                                ? "bg-slate-900 text-white border-slate-900"
                                                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-400"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                                            {ROLE_ICONS[r.name] ?? "manage_accounts"}
                                        </span>
                                        {r.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {errors.rol && <p className="text-[11px] text-rose-500">{errors.rol}</p>}
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
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>person_add</span>
                        {loading ? "Creando..." : "Crear usuario"}
                    </button>
                </div>

            </div>
        </div>
    );
}