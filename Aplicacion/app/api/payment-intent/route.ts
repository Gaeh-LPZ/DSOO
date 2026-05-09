import { createStripePaymentIntentAction } from "@/modules/sale/sale.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { saleId } = await req.json();
    const clientSecret = await createStripePaymentIntentAction({ saleId });
    return NextResponse.json({ clientSecret });
}