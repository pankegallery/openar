/*
  Warnings:

  - You are about to drop the column `heroImageId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_heroImageId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "heroImageId",
ADD COLUMN     "profileImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("profileImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
