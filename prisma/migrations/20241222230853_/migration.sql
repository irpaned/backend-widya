/*
  Warnings:

  - Made the column `price` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product" ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" DROP DEFAULT;
