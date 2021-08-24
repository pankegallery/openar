/*
  Warnings:

  - You are about to drop the column `ownerEthAdress` on the `ArObject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArObject" DROP COLUMN "ownerEthAdress",
ADD COLUMN     "ownerEthAddress" VARCHAR(42),
ALTER COLUMN "orderNumber" DROP NOT NULL,
ALTER COLUMN "editionOf" DROP NOT NULL,
ALTER COLUMN "editionNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "orderNumber" DROP NOT NULL;
