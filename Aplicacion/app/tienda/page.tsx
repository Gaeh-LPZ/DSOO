import { listProductsAction } from "@/modules/product/product.actions";
import ProductGrid from "./ProductGrid";

export default async function TiendaPage() {
    const productos = await listProductsAction({});
    
    return (
        <main style={{ backgroundColor: "#fafaf5" }} className="min-h-screen">
            <ProductGrid productos={productos} />
        </main>
    );
}