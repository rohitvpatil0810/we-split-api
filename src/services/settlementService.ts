import { Prisma, PrismaClient, SettlementTypes } from "@prisma/client";
import prisma from "../utils/prisma";

class SettlementService {
  private calculatePayersAndReceivers(
    expenseParticipants: Prisma.ExpenseParticipantCreateManyInput[]
  ) {
    const expenseParticipantsWithBalance = expenseParticipants.map(
      (participant) => ({
        ...participant,
        balance: participant.amountPaid - participant.share,
      })
    );
    let receivers = expenseParticipantsWithBalance.filter((participant) => {
      return participant.balance > 0;
    });
    let payers = expenseParticipantsWithBalance.filter((participant) => {
      return participant.balance < 0;
    });
    payers = payers.map((payer) => ({
      ...payer,
      balance: Math.abs(payer.balance),
    }));

    return { receivers, payers };
  }

  private calculateSettlements(
    expenseParticipants: Prisma.ExpenseParticipantCreateManyInput[],
    userId: string
  ) {
    /*
      Logic is like 
      In settlements if receiver is going to receive money from payer
      but at time expense creation it not paid, 
      So, we make settlements such as receiver paid money to payer (i.e. Lended)
      And Record this settlements as Expense Type
    */

    const relatedExpenseId = expenseParticipants[0].expenseId;
    let { receivers, payers } =
      this.calculatePayersAndReceivers(expenseParticipants);
    let settlements: Array<Prisma.SettlementCreateManyInput> = [];
    while (receivers.length > 0 && payers.length > 0) {
      let currentPayer = payers[0],
        currentPayee = receivers[0];
      let minAmount = Math.min(currentPayee.balance, currentPayer.balance);
      settlements.push({
        relatedExpenseId,
        amount: minAmount,
        payeeId: currentPayer.userId,
        payerId: currentPayee.userId,
        settlementType: SettlementTypes.EXPENSE,
        createdBy: userId,
      });
      currentPayee.balance -= minAmount;
      currentPayer.balance -= minAmount;
      if (currentPayee.balance == 0) receivers.shift();
      else receivers[0] = currentPayee;
      if (currentPayer.balance == 0) payers.shift();
      else payers[0] = currentPayer;
    }
    return settlements;
  }

  createSettlementsInput(
    expenseParticipants: Prisma.ExpenseParticipantCreateManyInput[],
    userId: string
  ) {
    try {
      const settlementInput = this.calculateSettlements(
        expenseParticipants,
        userId
      );

      return settlementInput;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error("Failed to create settlements due to database error.");
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to create settlementsa.");
      }
    }
  }

  async getSettlmentsBetweentTwoUser(user1Id: string, user2Id: string) {
    try {
      let settlements = await prisma.settlement.findMany({
        where: {
          OR: [
            { payeeId: user1Id },
            { payeeId: user2Id },
            { payerId: user1Id },
            { payerId: user2Id },
          ],
        },
        select: {
          id: true,
          payeeId: true,
          payerId: true,
          amount: true,
          settlementType: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          createdByUser: { select: { id: true, username: true } },
          updatedByUser: { select: { id: true, username: true } },
          expense: {
            select: {
              id: true,
              description: true,
              updatedAt: true,
              createdAt: true,
              createdByUser: { select: { id: true, username: true } },
              updatedByUser: { select: { id: true, username: true } },
            },
          },
        },
      });

      settlements = settlements.map((settlement) => {
        if (settlement.payeeId === user1Id)
          settlement.amount = -1 * settlement.amount;
        return settlement;
      });

      return settlements;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error("Failed to get settlements due to database error.");
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to get settlements amount.");
      }
    }
  }

  async calcuateTotalSettlementAmountBetweenTwoUser(
    user1Id: string,
    user2Id: string
  ) {
    try {
      const settlements = await prisma.settlement.findMany({
        where: {
          OR: [
            { payeeId: user1Id },
            { payeeId: user2Id },
            { payerId: user1Id },
            { payerId: user2Id },
          ],
          isDeleted: false,
        },
        select: {
          payeeId: true,
          payerId: true,
          amount: true,
        },
      });
      let totalSettlmentAmount = settlements.reduce((total, settlement) => {
        if (settlement.payeeId === user1Id) return total - settlement.amount;
        else return (total += settlement.amount);
      }, 0);

      return totalSettlmentAmount;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error(
          "Failed to calculate total settlement amount due to database error."
        );
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to calculate total settlement amount.");
      }
    }
  }

  async createPaymentSettlement(
    payerId: string,
    payeeId: string,
    amount: number,
    userId: string
  ) {
    try {
      const paymentSettlement = await prisma.settlement.create({
        data: {
          payerId,
          payeeId,
          amount,
          settlementType: SettlementTypes.PAYMENT,
          createdBy: userId,
        },
      });

      return paymentSettlement;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error(
          "Failed to creaate payement settlement due to database error."
        );
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to create payment settlement.");
      }
    }
  }

  private async isUserInSettlement(
    id: string,
    userId: string
  ): Promise<boolean> {
    try {
      const settlement = await prisma.settlement.findFirst({
        where: {
          id,
          OR: [{ payeeId: userId }, { payerId: userId }],
          isDeleted: false,
          settlementType: SettlementTypes.PAYMENT,
        },
      });
      if (settlement) return true;
      return false;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error(
          "Failed to check is user in settlement due to database error."
        );
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to check is user in settlement.");
      }
    }
  }

  async deletePaymentSettlement(settlementId: string, deletingUserId: string) {
    try {
      const isSettlementPresent = await this.isUserInSettlement(
        settlementId,
        deletingUserId
      );

      if (!isSettlementPresent)
        throw new Error("User is not allowed to delete payment");

      const deletedPayementSettlement = await prisma.settlement.update({
        where: { id: settlementId },
        data: {
          isDeleted: true,
          updatedBy: deletingUserId,
        },
      });

      return deletedPayementSettlement;
    } catch (error: any) {
      console.log("Failed to delete payement:", error.message);
      throw new Error(`Failed to delete payment:  ${error.message}`);
    }
  }
}

export default new SettlementService();
