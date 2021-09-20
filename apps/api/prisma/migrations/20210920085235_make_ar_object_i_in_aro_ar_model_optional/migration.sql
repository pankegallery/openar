-- DropForeignKey
ALTER TABLE "ArModel" DROP CONSTRAINT "ArModel_arObjectId_fkey";

-- AlterTable
ALTER TABLE "ArModel" ALTER COLUMN "arObjectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ArModel" ADD CONSTRAINT "ArModel_arObjectId_fkey" FOREIGN KEY ("arObjectId") REFERENCES "ArObject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
