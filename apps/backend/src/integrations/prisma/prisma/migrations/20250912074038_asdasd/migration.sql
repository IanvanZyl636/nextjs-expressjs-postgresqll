-- DropForeignKey
ALTER TABLE "public"."Token" DROP CONSTRAINT "Token_sessionId_fkey";

-- AlterTable
ALTER TABLE "public"."Token" ALTER COLUMN "sessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
