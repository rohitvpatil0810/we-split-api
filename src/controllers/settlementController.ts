import { Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import SettlementService from "../services/settlementService";

class SettlementController {
  async calculateTotalSettlementAmount(
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
}

export default new SettlementController();
