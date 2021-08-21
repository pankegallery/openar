/*
  Warnings:

  - A unique constraint covering the columns `[ethAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User.ethAddress_unique" ON "User"("ethAddress");
