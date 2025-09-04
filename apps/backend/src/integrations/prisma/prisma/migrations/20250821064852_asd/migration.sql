/*
  Warnings:

  - You are about to drop the `ProductVariantMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductVariantMedia" DROP CONSTRAINT "ProductVariantMedia_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductVariantMedia" DROP CONSTRAINT "ProductVariantMedia_productVariantId_fkey";

-- DropTable
DROP TABLE "public"."ProductVariantMedia";

-- CreateTable
CREATE TABLE "public"."ProductVariantGalleryMedia" (
    "id" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "productVariantId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "ProductVariantGalleryMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductVariantAttachment" (
    "id" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "ProductVariantAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariantGalleryMedia_mediaId_key" ON "public"."ProductVariantGalleryMedia"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariantAttachment_mediaId_key" ON "public"."ProductVariantAttachment"("mediaId");

-- AddForeignKey
ALTER TABLE "public"."ProductVariantGalleryMedia" ADD CONSTRAINT "ProductVariantGalleryMedia_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariantGalleryMedia" ADD CONSTRAINT "ProductVariantGalleryMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariantAttachment" ADD CONSTRAINT "ProductVariantAttachment_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariantAttachment" ADD CONSTRAINT "ProductVariantAttachment_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
