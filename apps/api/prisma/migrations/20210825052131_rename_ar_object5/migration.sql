/*
  Warnings:

  - You are about to drop the column `askedPrice` on the `ArObject` table. All the data in the column will be lost.
  - You are about to drop the column `collectorId` on the `ArObject` table. All the data in the column will be lost.
  - You are about to drop the column `editionNumber` on the `ArObject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArObject" DROP CONSTRAINT "ArObject_collectorId_fkey";

-- AlterTable
ALTER TABLE "ArObject" DROP COLUMN "askedPrice",
DROP COLUMN "collectorId",
DROP COLUMN "editionNumber",
ADD COLUMN     "askPrice" DECIMAL(65,30) DEFAULT 0.0,
ADD COLUMN     "sold" INTEGER;

-- CreateTable
CREATE TABLE "ArObject2Collector" (
    "id" SERIAL NOT NULL,
    "arObjectId" INTEGER NOT NULL,
    "userId" INTEGER,
    "tokenId" TEXT NOT NULL,
    "editonNumber" INTEGER NOT NULL,
    "ownerEthAddress" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArObject2Collector" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArObject2Collector" ADD FOREIGN KEY ("arObjectId") REFERENCES "ArObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
