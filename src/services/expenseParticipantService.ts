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
}

export default new ExpenseParticipantService();
