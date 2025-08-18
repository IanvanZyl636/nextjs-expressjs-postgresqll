/*
  Warnings:

  - Made the column `name` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stock` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductVariant" ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "stock" SET NOT NULL;
