/*
  Warnings:

  - Added the required column `createdBy` to the `Settlement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settlement" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT '4eed1d23-bd8f-4e60-be1a-75768c1f1bfa',
ADD COLUMN     "updatedBy" TEXT;

ALTER TABLE "Settlement" ALTER COLUMN "createdBy" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
