import { getCustomerProfileAction } from "@/modules/customer/customer.actions";
import PerfilClientContent from "./PerfilClientContent";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
    const result = await getCustomerProfileAction();

    if (!result.success || !result.data) redirect("/login");

    return (
        <main className="px-4 sm:px-6 lg:px-8 py-10 w-full flex-1" style={{ backgroundColor: "#fafaf5" }}>
            <PerfilClientContent userData={result.data} />
        </main>
    );
}