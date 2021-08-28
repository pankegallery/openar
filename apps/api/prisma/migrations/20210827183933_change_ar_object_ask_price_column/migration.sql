/*
  Warnings:

  - You are about to alter the column `askPrice` on the `ArObject` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "ArObject" ALTER COLUMN "askPrice" SET DATA TYPE DOUBLE PRECISION;
