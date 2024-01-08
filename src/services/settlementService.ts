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
    expenseParticipants: Prisma.ExpenseParticipantCreateManyInput[]
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
    expenseParticipants: Prisma.ExpenseParticipantCreateManyInput[]
  ) {
    try {
      const settlementInput = this.calculateSettlements(expenseParticipants);

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

  private calculateSettlmentsBetweentTwoUser() {}

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
}

export default new SettlementService();
