/*
  Warnings:

  - The values [COMPLETED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customerId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shipmentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipmentId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ShippingType" AS ENUM ('COLLECT', 'COURIER');

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('PAYFAST');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentStatus_new" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED', 'CANCELLED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" TYPE "public"."PaymentStatus_new" USING ("status"::text::"public"."PaymentStatus_new");
ALTER TYPE "public"."PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "public"."PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_shippingAddressId_fkey";

-- AlterTable
ALTER TABLE "public"."Address" DROP COLUMN "customerId";

-- AlterTable
ALTER TABLE "public"."Customer" DROP COLUMN "name",
DROP COLUMN "phoneNumber",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "shippingAddressId",
DROP COLUMN "total",
ADD COLUMN     "shipmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "method",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'ZAR',
ADD COLUMN     "provider" "public"."PaymentProvider" NOT NULL,
ADD COLUMN     "providerRef" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."PaymentMethod";

-- CreateTable
CREATE TABLE "public"."ShippingMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ShippingType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "flatPrice" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShippingContactInformation" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingContactInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShippingAddress" (
    "id" TEXT NOT NULL,
    "shippingContactInformationId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shipment" (
    "id" TEXT NOT NULL,
    "shippingMethodId" TEXT NOT NULL,
    "shippingAddressId" TEXT,
    "comment" TEXT,
    "trackingNumber" TEXT,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_shippingContactInformationId_key" ON "public"."ShippingAddress"("shippingContactInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_addressId_key" ON "public"."ShippingAddress"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_customerId_key" ON "public"."ShippingAddress"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_trackingNumber_key" ON "public"."Shipment"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_shipmentId_key" ON "public"."Order"("shipmentId");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "public"."Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShippingAddress" ADD CONSTRAINT "ShippingAddress_shippingContactInformationId_fkey" FOREIGN KEY ("shippingContactInformationId") REFERENCES "public"."ShippingContactInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShippingAddress" ADD CONSTRAINT "ShippingAddress_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShippingAddress" ADD CONSTRAINT "ShippingAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shipment" ADD CONSTRAINT "Shipment_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "public"."ShippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shipment" ADD CONSTRAINT "Shipment_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "public"."ShippingAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
