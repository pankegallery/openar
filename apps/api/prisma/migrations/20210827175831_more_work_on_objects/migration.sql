/*
  Warnings:

  - You are about to drop the column `ownerEthAddress` on the `ArObject` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `ArObject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArObject" DROP COLUMN "ownerEthAddress",
DROP COLUMN "sold";

-- AlterTable
ALTER TABLE "ArObject2Collector" ADD COLUMN     "sold" BOOLEAN;
