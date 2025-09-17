/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Vendor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Vendor" DROP CONSTRAINT "Vendor_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."Vendor" DROP COLUMN "ownerId";
