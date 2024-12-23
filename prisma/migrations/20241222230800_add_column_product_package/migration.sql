/*
  Warnings:

  - Added the required column `description` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qty` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "discount" INTEGER DEFAULT 0,
ADD COLUMN     "priceBeforeDiscount" INTEGER DEFAULT 0,
ADD COLUMN     "qty" INTEGER NOT NULL;
