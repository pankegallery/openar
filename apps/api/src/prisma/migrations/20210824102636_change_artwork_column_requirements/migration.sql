/*
  Warnings:

  - Made the column `description` on table `Artwork` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Artwork" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT E'',
ALTER COLUMN "lat" DROP NOT NULL,
ALTER COLUMN "lng" DROP NOT NULL;
