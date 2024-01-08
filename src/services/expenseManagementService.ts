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
          expenseParticipantsInput
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
}

export default new ExpenseManagementService();
