/*
  Warnings:

  - You are about to drop the column `objectId` on the `Model` table. All the data in the column will be lost.
  - Added the required column `arObjectId` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_objectId_fkey";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "objectId",
ADD COLUMN     "arObjectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Model" ADD FOREIGN KEY ("arObjectId") REFERENCES "ArObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
