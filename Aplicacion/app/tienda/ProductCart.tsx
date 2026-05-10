// components/ProductCard.tsx
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
    producto: Product;
}

export default function ProductCard({ producto }: Props) {
    const [hover, setHover] = useState(false);
    const router = useRouter();

    return (
        <div
            className="group cursor-pointer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "1/1" }}>
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
                        hover ? "translate-y-0" : "translate-y-full"
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
    );
}