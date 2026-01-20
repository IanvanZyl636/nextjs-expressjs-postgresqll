/*
  Warnings:

  - You are about to drop the column `userId` on the `Cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropIndex
DROP INDEX "public"."Cart_userId_idx";

-- AlterTable
ALTER TABLE "public"."Cart" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "cartId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cartId_key" ON "public"."Customer"("cartId");

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
