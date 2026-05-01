"use client"

import { registerAction } from "@/modules/user/user.actions"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegistroForm() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmarPassword, setConfirmarPassword] = useState("")
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

        try {
            await registerAction({ name, email, password })
            router.push("/login")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
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
                    />
                    <input
                        className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                        placeholder="Dirección de Email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                        placeholder="contraseña"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                        placeholder="Confirmar Contraseña"
                        type="password"
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button className="w-full silk-gradient text-white py-4 rounded-lg font-label font-medium tracking-wide shadow-xl transition-all active:scale-[0.98] mt-4" type="submit">
                    Crear cuenta
                    {loading ? "Cargando..." : "Crear Cuenta"}
                </button>
            </form>
        </div>
    )
}
