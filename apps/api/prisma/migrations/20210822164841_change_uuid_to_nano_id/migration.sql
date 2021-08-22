/*
  Warnings:

  - You are about to drop the column `uuid` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `Model` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nanoid]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nanoid]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nanoid]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nanoid` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nanoid` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nanoid` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File.uuid_unique";

-- DropIndex
DROP INDEX "Image.uuid_unique";

-- DropIndex
DROP INDEX "Model.uuid_unique";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "uuid",
ADD COLUMN     "nanoid" VARCHAR(21) NOT NULL;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "uuid",
ADD COLUMN     "nanoid" VARCHAR(21) NOT NULL;

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "uuid",
ADD COLUMN     "nanoid" VARCHAR(21) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File.nanoid_unique" ON "File"("nanoid");

-- CreateIndex
CREATE UNIQUE INDEX "Image.nanoid_unique" ON "Image"("nanoid");

-- CreateIndex
CREATE UNIQUE INDEX "Model.nanoid_unique" ON "Model"("nanoid");
