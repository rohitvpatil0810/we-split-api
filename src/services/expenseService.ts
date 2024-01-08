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
}

export default new ExpenseService();
