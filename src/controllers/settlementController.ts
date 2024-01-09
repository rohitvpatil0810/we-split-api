import { Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import SettlementService from "../services/settlementService";
import {
  addPayementValidator,
  addReceiveValidator,
} from "../validators/settlementValidators";
import { validationResult } from "express-validator";

class SettlementController {
  async calculateTotalSettlementWithUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (req.user) {
        const user1Id = req.user.id;
        const user2Id = req.params.user2Id;
        if (!user2Id) {
          res.status(400).json({
            error: "User2 Id is required",
          });
          return;
        }

        const totalSettlementAmount =
          await SettlementService.calcuateTotalSettlementAmountBetweenTwoUser(
            user1Id,
            user2Id
          );
        res.status(200).json({
          totalSettlementAmount,
        });
      }
    } catch (error: any) {
      console.log("Error calculating total settlement amount:", error.message);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async getAllSettlementsWithUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (req.user) {
        const user1Id = req.user.id;
        const user2Id = req.params.user2Id;
        if (!user2Id) {
          res.status(400).json({
            error: "User2 Id is required",
          });
          return;
        }
        const setttlements =
          await SettlementService.getSettlmentsBetweentTwoUser(
            user1Id,
            user2Id
          );
        res.status(200).json({
          setttlements,
        });
      }
    } catch (error: any) {
      console.log("Error getting settlements amount:", error.message);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async addPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user) {
        const payerId = req.user.id;
        await Promise.all(
          addPayementValidator.map((validator) => validator.run(req))
        );
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({
            errors: errors.array(),
          });
          return;
        }
        const { payeeId, amount } = req.body;

        const payement = await SettlementService.createPaymentSettlement(
          payerId,
          payeeId,
          amount,
          payerId
        );
        res.status(200).json({
          payement,
        });
      }
    } catch (error: any) {
      console.log("Error adding payment:", error.message);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async addReceive(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user) {
        const payeeId = req.user.id;
        await Promise.all(
          addReceiveValidator.map((validator) => validator.run(req))
        );
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({
            errors: errors.array(),
          });
          return;
        }
        const { payerId, amount } = req.body;

        const receive = await SettlementService.createPaymentSettlement(
          payerId,
          payeeId,
          amount,
          payeeId
        );
        res.status(200).json({
          receive,
        });
      }
    } catch (error: any) {
      console.log("Error adding payment:", error.message);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async deletePayement(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const settlementId = req.params.id;
      if (!settlementId) {
        res.status(400).json({
          error: "Settlement id is required",
        });
        return;
      }
      if (req.user) {
        const deletedPayment = await SettlementService.deletePaymentSettlement(
          settlementId,
          req.user.id
        );

        res.status(200).json({
          deletedPayment,
        });
      }
    } catch (error: any) {
      console.log("Error deleting payment:", error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

export default new SettlementController();
