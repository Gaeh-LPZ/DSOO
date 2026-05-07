"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    imageUrl: string | null;
}

interface Props {
    productos: Product[];
}

const categorias = [
    { id: "todos", label: "Todos" },
    { id: "accesorios", label: "Accesorios" },
    { id: "joyeria", label: "Joyería" },
    { id: "ropa", label: "Ropa" },
];

const categoriaMap: Record<string, string[]> = {
    accesorios: ["SKU-001", "SKU-002", "SKU-003"],
    joyeria: ["SKU-004"],
    ropa: ["SKU-005"],
};

const categoryHero: Record<string, { title: string; subtitle: string; from: string; to: string }> = {
    todos: {
        title: "La Tienda",
        subtitle: "Piezas únicas seleccionadas para quienes aprecian lo extraordinario.",
        from: "#1e293b",
        to: "#334155",
    },
    accesorios: {
        title: "Accesorios",
        subtitle: "Complementos que definen tu estilo.",
        from: "#292524",
        to: "#57534e",
    },
    joyeria: {
        title: "Joyería",
        subtitle: "Piezas eternas que trascienden las temporadas.",
        from: "#78350f",
        to: "#b45309",
    },
    ropa: {
        title: "Ropa",
        subtitle: "Diseños que visten la elegancia de lo cotidiano.",
        from: "#27272a",
        to: "#52525b",
    },
};

export default function ProductGrid({ productos }: Props) {
    const [hover, setHover] = useState<string | null>(null);
    const [categoriaActiva, setCategoriaActiva] = useState("todos");
    const router = useRouter();

    const productosFiltrados = categoriaActiva === "todos"
        ? productos
        : productos.filter(p => categoriaMap[categoriaActiva]?.includes(p.sku));

    const hero = categoryHero[categoriaActiva];

    return (
        <div>
            <div
                style={{ background: `linear-gradient(to right, ${hero.from}, ${hero.to})` }}
                className="text-white px-8 py-20 text-center"
            >
                <p className="text-xs uppercase tracking-widest mb-3" style={{ opacity: 0.6 }}>Colección 2026</p>
                <h1 className="font-serif text-5xl md:text-7xl mb-4">{hero.title}</h1>
                <p className="text-sm max-w-md mx-auto" style={{ opacity: 0.7 }}>{hero.subtitle}</p>
            </div>

            <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
                <div className="max-w-screen-2xl mx-auto px-8 flex items-center justify-between">
                    <div className="flex">
                        {categorias.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoriaActiva(cat.id)}
                                className={`px-6 py-5 text-xs uppercase tracking-widest transition-colors border-b-2 ${
                                    categoriaActiva === cat.id
                                        ? "border-slate-900 text-slate-900 font-medium"
                                        : "border-transparent text-slate-400 hover:text-slate-700"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400">{productosFiltrados.length} productos</p>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto px-8 py-12">
                {productosFiltrados.length === 0 ? (
                    <div className="text-center py-32 text-slate-400">
                        <span className="material-symbols-outlined text-6xl mb-4 block">inventory_2</span>
                        <p className="text-lg">No hay productos en esta categoría.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productosFiltrados.map((producto) => (
                            <div
                                key={producto.id}
                                className="group cursor-pointer"
                                onMouseEnter={() => setHover(producto.id)}
                                onMouseLeave={() => setHover(null)}
                            >
                                <div
                                    className="relative w-full overflow-hidden bg-slate-100"
                                    style={{ aspectRatio: "1/1" }}
                                >
                                    {producto.imageUrl ? (
                                        <img
                                            src={producto.imageUrl}
                                            alt={producto.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-6xl text-slate-300">image</span>
                                        </div>
                                    )}
                                    <div
                                        onClick={() => router.push(`/carrito?id=${producto.id}`)}
                                        className={`absolute bottom-0 left-0 right-0 text-white text-xs uppercase tracking-widest py-3 text-center transition-transform duration-300 cursor-pointer ${
                                            hover === producto.id ? "translate-y-0" : "translate-y-full"
                                        }`}
                                        style={{ backgroundColor: "rgba(15,23,42,0.9)" }}
                                    >
                                        Agregar al carrito
                                    </div>
                                </div>
                                <div className="pt-4 pb-2">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{producto.sku}</p>
                                    <h3 className="font-serif text-slate-900 text-base leading-snug mb-1 truncate">{producto.name}</h3>
                                    <p className="text-slate-700 text-sm font-medium">${producto.price.toLocaleString("es-MX")} MXN</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}