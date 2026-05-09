import { redirect } from "next/navigation";
import { getSaleAction } from "@/modules/sale/sale.actions";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage({searchParams, }: {searchParams: Promise<{ saleId?: string }>;}) {
  const { saleId } = await searchParams;
  if (!saleId) redirect("/carrito");

  const sale = await getSaleAction({ saleId });
  if (!sale) redirect("/carrito");

  if (sale.status !== "PENDING") redirect("/");

  return (
    <CheckoutForm
      saleId={saleId}
      total={sale.total}
    />
  );
}