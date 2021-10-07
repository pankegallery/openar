-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_heroImageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileImageId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
