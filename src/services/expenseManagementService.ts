import { Prisma } from "@prisma/client";
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error("Failed to add expense due to database error.");
      }
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error("Failed to delete expense due to database error.");
      }
      console.log("Failed to delete Expense:", error.message);
      throw new Error(`Failed to delete Expense:  ${error.message}`);
    }
  }

  async updateExpense(
    expenseId: string,
    amount: number,
    description: string,
    users: Array<{ userId: string; share: number; amountPaid: number }>,
    version: number,
    updatingUserId: string
  ) {
    try {
      const isExpensePresent = await ExpenseService.isExpensePresent(expenseId);
      if (!isExpensePresent) {
        throw Error("Expesne is not present.");
      }
      const isParticipant = await ExpenseParticipantService.isUserInExpense(
        expenseId,
        updatingUserId
      );
      if (!isParticipant) {
        throw Error("User is not allowed to update expense");
      }
      const updatedExpense = await prisma.$transaction(async (tx) => {
        const updatedExpense = await tx.expense.update({
          where: {
            id: expenseId,
            version,
          },
          data: {
            amount,
            description,
            version: version + 1,
            updatedBy: updatingUserId,
          },
        });

        const deletedExpenseParticipants =
          await tx.expenseParticipant.deleteMany({ where: { expenseId } });

        const deleteSettlements = await tx.settlement.deleteMany({
          where: { relatedExpenseId: expenseId },
        });

        const expenseParticipantsInput =
          ExpenseParticipantService.createExpenseParticipantsInput(
            users,
            expenseId
          );
        const expenseParticipants = await tx.expenseParticipant.createMany({
          data: expenseParticipantsInput,
        });

        const settlementsInput = SettlementService.createSettlementsInput(
          expenseParticipantsInput,
          updatingUserId
        );
        const settlements = await tx.settlement.createMany({
          data: settlementsInput,
        });

        return updatedExpense;
      });

      return updatedExpense;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        if (error.code == "P2025") {
          throw new Error(
            "The expense has been updated by another user. Please refresh and try again."
          );
        }
        throw new Error("Failed to update payment due to database error.");
      }

      console.log("Failed to update Expense:", error.message);
      throw new Error(`Failed to update Expense:  ${error.message}`);
    }
  }
}

export default new ExpenseManagementService();
