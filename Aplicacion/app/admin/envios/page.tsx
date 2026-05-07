import { getAllShipmentsAction } from "@/modules/shipment/shipment.actions";
import EnviosClientContent from "./EnviosClientContent";


export default async function EnviosPage() {
    const result = await getAllShipmentsAction();
    const envios = result.success ? result.data ?? [] : [];

    return (
        <main className="px-4 sm:px-6 lg:px-8 py-10 w-full flex-1" style={{ backgroundColor: "#fafaf5" }}>
            <h1 className="font-serif text-3xl mb-8">Gestión de Envíos</h1>
            <EnviosClientContent envios={envios} />
        </main>
    );
}