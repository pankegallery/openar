/*
  Warnings:

  - You are about to drop the `Object` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_objectId_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_collectorId_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_heroImageId_fkey";

-- DropForeignKey
ALTER TABLE "_imagesObject" DROP CONSTRAINT "_imagesObject_A_fkey";

-- DropForeignKey
ALTER TABLE "_imagesObject" DROP CONSTRAINT "_imagesObject_B_fkey";

-- DropTable
DROP TABLE "Object";

-- CreateTable
CREATE TABLE "ArObject" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(16) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "description" TEXT,
    "orderNumber" INTEGER NOT NULL DEFAULT 0,
    "editionOf" INTEGER NOT NULL,
    "editionNumber" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "ownerEthAdress" VARCHAR(42),
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" INTEGER NOT NULL,
    "collectorId" INTEGER,
    "artworkId" INTEGER NOT NULL,
    "heroImageId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArObject.key_unique" ON "ArObject"("key");

-- AddForeignKey
ALTER TABLE "ArObject" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArObject" ADD FOREIGN KEY ("collectorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArObject" ADD FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArObject" ADD FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD FOREIGN KEY ("objectId") REFERENCES "ArObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_imagesObject" ADD FOREIGN KEY ("A") REFERENCES "ArObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_imagesObject" ADD FOREIGN KEY ("B") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
