/*
  Warnings:

  - You are about to drop the column `public` on the `ArObject` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `Artwork` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArObject" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;
