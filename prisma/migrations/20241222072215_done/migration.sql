/*
  Warnings:

  - You are about to drop the `ProductPurchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verifications` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `photoProduct` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProductPurchase" DROP CONSTRAINT "ProductPurchase_userId_fkey";

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "photoProduct" SET NOT NULL;

-- DropTable
DROP TABLE "ProductPurchase";

-- DropTable
DROP TABLE "verifications";
