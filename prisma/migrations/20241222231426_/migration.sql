/*
  Warnings:

  - You are about to drop the column `priceBeforeDiscount` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "priceBeforeDiscount",
ADD COLUMN     "priceAfterDiscount" INTEGER DEFAULT 0;
