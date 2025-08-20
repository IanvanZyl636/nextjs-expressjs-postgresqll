/*
  Warnings:

  - The `weight` column on the `ProductVariant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."ProductVariant" DROP COLUMN "weight",
ADD COLUMN     "weight" JSONB;
