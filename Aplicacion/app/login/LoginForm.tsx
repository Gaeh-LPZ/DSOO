"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginAction } from "@/modules/user/user.actions"

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await loginAction({ email, password })
            router.push("/perfil")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="w-full max-w-md mx-auto">
                <div className="mb-10">
                    <h1 className="font-headline text-4xl font-bold text-primary mb-3">Bienvenido de nuevo</h1>
                    <p className="text-on-surface-variant font-body">Inicia sesion para comenzar a disfrutar de los beneficios exclusivos que tenemos para ti.</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div className="group">
                            <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Direccion de email</label>
                            <input
                                className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                                placeholder="tucorreo@luxury.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* Password Field */}
                        <div className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant">Contraseña</label>
                                <a href="#" className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors">olvido su contraseña contraseña?</a>
                            </div>
                            <div className="relative">
                                <input
                                    className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md"
                                    placeholder="••••••••"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button disabled={loading} className="w-full py-5 silk-gradient text-white font-label text-sm uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-all duration-300 rounded shadow-lg shadow-primary-container/10" type="submit">
                        {loading ? "Cargando..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-12 flex items-center">
                    <div className="flex-grow border-t border-outline-variant/20"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-label tracking-widest text-on-surface-variant/40 uppercase">O iniciar sesion con</span>
                    <div className="flex-grow border-t border-outline-variant/20"></div>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 py-4 border border-outline-variant/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-xl">google</span>
                        <span className="text-xs font-semibold uppercase tracking-wider">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-3 py-4 border border-outline-variant/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>apple</span>
                        <span className="text-xs font-semibold uppercase tracking-wider">Apple</span>
                    </button>
                </div>

                <p className="mt-12 text-center text-sm font-body text-on-surface-variant">
                    No tiene una cuenta?
                    <Link href="/registro" className="text-primary font-semibold hover:underline underline-offset-4 ml-1">
                        Crear una cuenta
                    </Link>
                </p>
            </div>
        </div>
    )
}