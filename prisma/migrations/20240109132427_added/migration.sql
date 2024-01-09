-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Settlement" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;
