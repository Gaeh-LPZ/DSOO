-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "stripePaymentId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
