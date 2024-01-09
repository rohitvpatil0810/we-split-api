import prisma from "../utils/prisma";
import ExpenseParticipantService from "./expenseParticipantService";
import ExpenseService from "./expenseService";
import SettlementService from "./settlementService";

class ExpenseManagementService {
  async addExpense(
    amount: number,
    description: string,
    users: Array<{ userId: string; share: number; amountPaid: number }>,
    userId: string
  ) {
    try {
      const expense = await prisma.$transaction(async (tx) => {
        const expenseInput = ExpenseService.createExpenseInput(
          amount,
          description,
          userId
        );
        const expense = await tx.expense.create({
          data: expenseInput,
        });

        const expenseParticipantsInput =
          ExpenseParticipantService.createExpenseParticipantsInput(
            users,
            expense.id
          );
        const expenseParticipants = await tx.expenseParticipant.createMany({
          data: expenseParticipantsInput,
        });

        const settlementsInput = SettlementService.createSettlementsInput(
          expenseParticipantsInput,
          userId
        );
        const settlements = await tx.settlement.createMany({
          data: settlementsInput,
        });

        return expense;
      });
      return expense;
    } catch (error: any) {
      console.log("Failed to add Expense:", error.message);
      throw new Error("Failed to add Expense.");
    }
  }

  async deleteExpense(expenseId: string, deletingUserId: string) {
    try {
      const isExpensePresent = await ExpenseService.isExpensePresent(expenseId);
      if (!isExpensePresent) {
        throw Error("Expesne is not present.");
      }
      const isParticipant = await ExpenseParticipantService.isUserInExpense(
        expenseId,
        deletingUserId
      );
      if (!isParticipant) {
        throw Error("User is not allowed to delete expense");
      }
      const expense = await prisma.$transaction(async (tx) => {
        const deletedExpense = await tx.expense.update({
          where: {
            id: expenseId,
          },
          data: {
            isDeleted: true,
            updatedBy: deletingUserId,
          },
        });

        const deletedExpenseParticipants =
          await tx.expenseParticipant.updateMany({
            where: {
              expenseId,
            },
            data: {
              isDeleted: true,
            },
          });

        const deletedSettlements = await tx.settlement.updateMany({
          where: {
            relatedExpenseId: expenseId,
          },
          data: {
            isDeleted: true,
            updatedBy: deletingUserId,
          },
        });
        return deletedExpense;
      });

      return expense;
    } catch (error: any) {
      console.log("Failed to delete Expense:", error.message);
      throw new Error(`Failed to delete Expense:  ${error.message}`);
    }
  }
}

export default new ExpenseManagementService();
