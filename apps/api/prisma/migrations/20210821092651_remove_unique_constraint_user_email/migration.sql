-- DropIndex
DROP INDEX "User.email_unique";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "email" DROP NOT NULL;
