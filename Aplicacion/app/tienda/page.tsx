import { listProductsAction } from "@/modules/product/product.actions";
import ProductGrid from "./ProductGrid";

export default async function TiendaPage() {
    const result = await listProductsAction({cantidad: 10});
    
    return (
        <main style={{ backgroundColor: "#fafaf5" }} className="min-h-screen">
            <ProductGrid productos={result} />
        </main>
    );
}