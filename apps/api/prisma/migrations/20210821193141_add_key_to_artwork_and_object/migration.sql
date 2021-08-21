/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Artwork` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Object` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Artwork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Object` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "key" VARCHAR(16) NOT NULL;

-- AlterTable
ALTER TABLE "Object" ADD COLUMN     "key" VARCHAR(16) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Artwork.key_unique" ON "Artwork"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Object.key_unique" ON "Object"("key");
