-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "pseudonym" TEXT,
    "ethAddress" VARCHAR(42),
    "roles" TEXT[],
    "url" TEXT,
    "bio" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "acceptedTerms" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "heroImageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artwork" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "url" TEXT,
    "video" TEXT,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "heroImageId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Object" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
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

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(48) NOT NULL,
    "meta" JSONB NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "ownerId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(48) NOT NULL,
    "meta" JSONB NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "format" VARCHAR(8) NOT NULL,
    "type" VARCHAR(8) NOT NULL,
    "objectId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(48) NOT NULL,
    "meta" JSONB NOT NULL,
    "artworkId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_imagesArtwork" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_imagesObject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Image.uuid_unique" ON "Image"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Model.uuid_unique" ON "Model"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "File.uuid_unique" ON "File"("uuid");

-- CreateIndex
CREATE INDEX "indexTokenOwnerId" ON "Token"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "_imagesArtwork_AB_unique" ON "_imagesArtwork"("A", "B");

-- CreateIndex
CREATE INDEX "_imagesArtwork_B_index" ON "_imagesArtwork"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_imagesObject_AB_unique" ON "_imagesObject"("A", "B");

-- CreateIndex
CREATE INDEX "_imagesObject_B_index" ON "_imagesObject"("B");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD FOREIGN KEY ("collectorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_imagesArtwork" ADD FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_imagesArtwork" ADD FOREIGN KEY ("B") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_imagesObject" ADD FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_imagesObject" ADD FOREIGN KEY ("B") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;
