import { Expense, Prisma, PrismaClient } from "@prisma/client";
import prisma from "../utils/prisma";

class ExpenseService {
  createExpenseInput(
    amount: number,
    description: string,
    userId: string
  ): Prisma.ExpenseCreateManyInput {
    const expense: Prisma.ExpenseCreateManyInput = {
      description,
      createdBy: userId,
      amount,
    };
    return expense;
  }

  async isExpensePresent(id: string): Promise<boolean> {
    try {
      const expense = await prisma.expense.findFirst({
        where: {
          id,
          isDeleted: false,
        },
      });
      if (expense) return true;
      return false;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error(
          "Failed to check is expense present due to database error."
        );
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to check is expense present.");
      }
    }
  }
}

export default new ExpenseService();
