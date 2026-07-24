-- AlterTable
ALTER TABLE "File" ADD COLUMN     "isExplicitlyDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "isExplicitlyDeleted" BOOLEAN NOT NULL DEFAULT false;
