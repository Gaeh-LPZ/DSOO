"use client"

import { registerCustomerAction } from "@/modules/customer/customer.actions"
import { registerAction } from "@/modules/user/user.actions"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegistroForm() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmarPassword, setConfirmarPassword] = useState("")
    const [fechaNacimiento, setFechaNacimiento] = useState("")

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmarPassword) {
            setError("Las contraseñas no coinciden")
            setLoading(false)
            return
        }

        if (!fechaNacimiento) {
            setError("La fecha de nacimiento es obligatoria para validar la edad.")
            setLoading(false)
            return
        }

        const isEmployee = email.endsWith("@luxury.com")

        if (isEmployee) {
            // Login Empleados
            await registerAction({ name, email, password })
            router.push("/login")

        } else {
            const resultado = await registerCustomerAction({ name, email, password, birthDate: new Date(fechaNacimiento) });

            if (resultado.success) {
                router.push("/login");
            } else {
                setError(resultado.message || "Error al registrarse");
            }
        }
        setLoading(false);
    }

    return (
        <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <input
                        className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                        placeholder="Nombre Completo"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                        placeholder="Dirección de Email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* NUEVO CAMPO: FECHA DE NACIMIENTO */}
                    <input
                        className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                        placeholder="Fecha de Nacimiento"
                        type="date"
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        required
                    />

                    <input
                        className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                        placeholder="Contraseña"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                        placeholder="Confirmar Contraseña"
                        type="password"
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>}

                <button
                    className="w-full silk-gradient text-white py-4 rounded-lg font-label font-medium tracking-wide shadow-xl transition-all active:scale-[0.98] mt-4 disabled:opacity-70"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Procesando registro..." : "Crear Cuenta de Lealtad"}
                </button>
            </form>
        </div>
    )
}