-- DropForeignKey
ALTER TABLE "ArModel" DROP CONSTRAINT "ArModel_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "ArModel" ADD CONSTRAINT "ArModel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
