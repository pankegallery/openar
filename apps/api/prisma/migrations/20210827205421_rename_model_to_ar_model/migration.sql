/*
  Warnings:

  - You are about to drop the `Model` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_arObjectId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_ownerId_fkey";

-- DropTable
DROP TABLE "Model";

-- CreateTable
CREATE TABLE "ArModel" (
    "id" SERIAL NOT NULL,
    "nanoid" VARCHAR(21) NOT NULL,
    "meta" JSONB NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "format" VARCHAR(8) NOT NULL,
    "type" VARCHAR(8) NOT NULL,
    "arObjectId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArModel.nanoid_unique" ON "ArModel"("nanoid");

-- AddForeignKey
ALTER TABLE "ArModel" ADD FOREIGN KEY ("arObjectId") REFERENCES "ArObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArModel" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
