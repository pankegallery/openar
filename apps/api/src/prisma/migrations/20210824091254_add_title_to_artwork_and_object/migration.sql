/*
  Warnings:

  - You are about to drop the column `name` on the `Object` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Object" DROP COLUMN "name",
ADD COLUMN     "title" TEXT;
