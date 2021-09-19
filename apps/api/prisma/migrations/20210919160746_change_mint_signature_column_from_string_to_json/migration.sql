/*
  Warnings:

  - The `mintSignature` column on the `ArObject` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "ArModel" DROP CONSTRAINT "ArModel_arObjectId_fkey";

-- DropForeignKey
ALTER TABLE "ArModel" DROP CONSTRAINT "ArModel_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ArObject" DROP CONSTRAINT "ArObject_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "ArObject" DROP CONSTRAINT "ArObject_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "ArObject2Collector" DROP CONSTRAINT "ArObject2Collector_arObjectId_fkey";

-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_ownerId_fkey";

-- AlterTable
ALTER TABLE "ArObject" DROP COLUMN "mintSignature",
ADD COLUMN     "mintSignature" JSONB;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArObject" ADD CONSTRAINT "ArObject_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArObject" ADD CONSTRAINT "ArObject_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArObject2Collector" ADD CONSTRAINT "ArObject2Collector_arObjectId_fkey" FOREIGN KEY ("arObjectId") REFERENCES "ArObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArModel" ADD CONSTRAINT "ArModel_arObjectId_fkey" FOREIGN KEY ("arObjectId") REFERENCES "ArObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArModel" ADD CONSTRAINT "ArModel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "ArModel.nanoid_unique" RENAME TO "ArModel_nanoid_key";

-- RenameIndex
ALTER INDEX "ArObject.key_unique" RENAME TO "ArObject_key_key";

-- RenameIndex
ALTER INDEX "Artwork.key_unique" RENAME TO "Artwork_key_key";

-- RenameIndex
ALTER INDEX "File.nanoid_unique" RENAME TO "File_nanoid_key";

-- RenameIndex
ALTER INDEX "Image.nanoid_unique" RENAME TO "Image_nanoid_key";

-- RenameIndex
ALTER INDEX "User.ethAddress_unique" RENAME TO "User_ethAddress_key";
