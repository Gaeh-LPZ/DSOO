import { listProductsAction } from "@/modules/product/product.actions";
import CategoriasNav from "../CategoriasNav";
import { notFound } from "next/navigation";
import ProductCard from "../ProductCart";

const categoryHero = {
    accesorios: {
        title: "Accesorios",
        subtitle: "Complementos que definen tu estilo.",
        from: "#292524", to: "#57534e",
    },
    joyeria: {
        title: "Joyería",
        subtitle: "Piezas eternas que trascienden las temporadas.",
        from: "#78350f", to: "#b45309",
    },
    ropa: {
        title: "Ropa",
        subtitle: "Diseños que visten la elegancia de lo cotidiano.",
        from: "#27272a", to: "#52525b",
    },
} as const;

type Categoria = keyof typeof categoryHero;

export default async function CategoriaPage({ params }: { params: { categoria: Categoria } }) {
    const { categoria } = await params

    const hero = categoryHero[categoria];
    if (!hero) notFound();

    const productos = await listProductsAction({ categoria });

    return (
        <main style={{ backgroundColor: "#fafaf5" }} className="min-h-screen">
            <div
                style={{ background: `linear-gradient(to right, ${hero.from}, ${hero.to})` }}
                className="text-white px-8 py-20 text-center"
            >
                <p className="text-xs uppercase tracking-widest mb-3" style={{ opacity: 0.6 }}>Colección 2026</p>
                <h1 className="font-serif text-5xl md:text-7xl mb-4">{hero.title}</h1>
                <p className="text-sm max-w-md mx-auto" style={{ opacity: 0.7 }}>{hero.subtitle}</p>
            </div>

            <CategoriasNav activa={categoria} total={productos.length} />

            <div className="max-w-screen-2xl mx-auto px-8 py-12">
                {productos.length === 0 ? (
                    <div className="text-center py-32 text-slate-400">
                        <span className="material-symbols-outlined text-6xl mb-4 block">inventory_2</span>
                        <p className="text-lg">No hay productos en esta categoría.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productos.map(producto => (
                            <ProductCard key={producto.id} producto={producto} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}