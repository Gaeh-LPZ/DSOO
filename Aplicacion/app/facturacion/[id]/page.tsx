import { getCustomerProfileAction } from "@/modules/customer/customer.actions";
import { getSaleSummaryAction } from "@/modules/sale/sale.actions";
import FacturaForm from "./FacturaForm";

interface PageProps {
  params: Promise<{ id: string }>; // En Next 15+ es una Promise
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [result, ventas] = await Promise.all([
    getCustomerProfileAction(),
    getSaleSummaryAction(id)
  ]);

  if (!result.success) {
    throw new Error(result.error || "Error al cargar el perfil");
  }

  if (!ventas.success) {
    throw new Error(ventas.message || "Error al cargar el resumen de venta");
  }

  return (
    <FacturaForm
      orderId={id}
      customer={result.data}
      ventas={ventas.data}
    />
  );
}