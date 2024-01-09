import { ExpenseParticipant, Prisma, PrismaClient } from "@prisma/client";
import prisma from "../utils/prisma";

class ExpenseParticipantService {
  createExpenseParticipantsInput(
    users: Array<{ userId: string; share: number; amountPaid: number }>,
    expenseId: string
  ): Prisma.ExpenseParticipantCreateManyInput[] {
    const participants: Prisma.ExpenseParticipantCreateManyInput[] = users.map(
      (user) => ({ ...user, expenseId })
    );
    return participants;
  }

  async getExpenseParticipantByUserId(userId: string) {
    try {
      const userExpenses = await prisma.expenseParticipant.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        select: {
          id: true,
          share: true,
          expense: {
            select: {
              createdAt: true,
              updatedAt: true,
              createdByUser: {
                select: {
                  username: true,
                },
              },
              updatedByUser: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      return userExpenses;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error("Failed to get user expenses due to database error.");
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to get user expenses.");
      }
    }
  }

  async isUserInExpense(expenseId: string, userId: string): Promise<boolean> {
    try {
      const expenseParticipant = await prisma.expenseParticipant.findFirst({
        where: {
          expenseId,
          userId,
        },
      });
      if (expenseParticipant) return true;
      return false;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error(
          "Failed to check is user in expense due to database error."
        );
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to check is user in expense.");
      }
    }
  }
}

export default new ExpenseParticipantService();
