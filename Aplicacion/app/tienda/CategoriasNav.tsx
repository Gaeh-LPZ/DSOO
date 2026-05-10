// app/tienda/CategoriasNav.tsx
import Link from "next/link";

const categorias = [
    { id: "todos",      label: "Todos",      href: "/tienda" },
    { id: "accesorios", label: "Accesorios", href: "/tienda/accesorios" },
    { id: "joyeria",    label: "Joyería",    href: "/tienda/joyeria" },
    { id: "ropa",       label: "Ropa",       href: "/tienda/ropa" },
];

export default function CategoriasNav({ activa, total }: { activa: string; total: number }) {
    return (
        <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
            <div className="max-w-screen-2xl mx-auto px-8 flex items-center justify-between">
                <div className="flex">
                    {categorias.map(cat => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className={`px-6 py-5 text-xs uppercase tracking-widest transition-colors border-b-2 ${
                                cat.id === activa
                                    ? "border-slate-900 text-slate-900 font-medium"
                                    : "border-transparent text-slate-400 hover:text-slate-700"
                            }`}
                        >
                            {cat.label}
                        </Link>
                    ))}
                </div>
                <p className="text-xs text-slate-400">{total} productos</p>
            </div>
        </div>
    );
}