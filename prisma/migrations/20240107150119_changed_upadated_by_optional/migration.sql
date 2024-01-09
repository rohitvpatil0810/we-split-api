-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_updatedBy_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
