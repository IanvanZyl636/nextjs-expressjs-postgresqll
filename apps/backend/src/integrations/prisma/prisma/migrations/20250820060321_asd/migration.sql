-- AlterTable
ALTER TABLE "public"."Image" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
