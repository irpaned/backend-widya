/*
  Warnings:

  - You are about to drop the column `isVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isVerifiedEmail` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `oauthId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_oauthId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isVerified",
DROP COLUMN "isVerifiedEmail",
DROP COLUMN "oauthId";
