/*
  Warnings:

  - A unique constraint covering the columns `[cardNumber]` on the table `LoyaltyAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cardNumber` to the `LoyaltyAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LoyaltyAccount" ADD COLUMN     "cardNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyAccount_cardNumber_key" ON "public"."LoyaltyAccount"("cardNumber");
