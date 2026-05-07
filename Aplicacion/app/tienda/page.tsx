import { getPublicProductsAction } from "@/modules/product/product.actions";
import ProductGrid from "./ProductGrid";

export default async function TiendaPage() {
    const result = await getPublicProductsAction();
    const productos = result.success ? result.data ?? [] : [];

    return (
        <main style={{ backgroundColor: "#fafaf5" }} className="min-h-screen">
            <ProductGrid productos={productos} />
        </main>
    );
}