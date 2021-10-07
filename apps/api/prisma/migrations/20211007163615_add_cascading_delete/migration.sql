/*
  Warnings:

  - You are about to drop the `ArObject2Collector` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArModel" DROP CONSTRAINT "ArModel_arObjectId_fkey";

-- DropForeignKey
ALTER TABLE "ArObject" DROP CONSTRAINT "ArObject_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "ArObject" DROP CONSTRAINT "ArObject_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "ArObject" DROP CONSTRAINT "ArObject_heroImageId_fkey";

-- DropForeignKey
ALTER TABLE "ArObject2Collector" DROP CONSTRAINT "ArObject2Collector_arObjectId_fkey";

-- DropForeignKey
ALTER TABLE "ArObject2Collector" DROP CONSTRAINT "ArObject2Collector_userId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_ownerId_fkey";

-- DropTable
DROP TABLE "ArObject2Collector";

-- AddForeignKey
ALTER TABLE "ArObject" ADD CONSTRAINT "ArObject_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArObject" ADD CONSTRAINT "ArObject_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArObject" ADD CONSTRAINT "ArObject_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArModel" ADD CONSTRAINT "ArModel_arObjectId_fkey" FOREIGN KEY ("arObjectId") REFERENCES "ArObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
