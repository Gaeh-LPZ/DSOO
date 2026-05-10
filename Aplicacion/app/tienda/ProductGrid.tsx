// app/tienda/ProductGrid.tsx
import Link from "next/link";
import ProductCard from "./ProductCart";
import CategoriasNav from "./CategoriasNav";


interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    imageUrl: string | null;
}

export default function ProductGrid({ productos }: { productos: Product[] }) {
    return (
        <div>
            <div
                style={{ background: "linear-gradient(to right, #1e293b, #334155)" }}
                className="text-white px-8 py-20 text-center"
            >
                <p className="text-xs uppercase tracking-widest mb-3" style={{ opacity: 0.6 }}>Colección 2026</p>
                <h1 className="font-serif text-5xl md:text-7xl mb-4">La Tienda</h1>
                <p className="text-sm max-w-md mx-auto" style={{ opacity: 0.7 }}>
                    Piezas únicas seleccionadas para quienes aprecian lo extraordinario.
                </p>
            </div>

            <CategoriasNav activa="todos" total={productos.length} />

            <div className="max-w-screen-2xl mx-auto px-8 py-12">
                {productos.length === 0 ? (
                    <div className="text-center py-32 text-slate-400">
                        <span className="material-symbols-outlined text-6xl mb-4 block">inventory_2</span>
                        <p className="text-lg">No hay productos disponibles.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productos.map(producto => (
                            <ProductCard key={producto.id} producto={producto} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}