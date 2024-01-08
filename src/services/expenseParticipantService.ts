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
        },
        select: {
          id: true,
          share: true,
          expense: {
            include: {
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
}

export default new ExpenseParticipantService();
