import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware";
import SettlementController from "../controllers/settlementController";

const settlementRouter = Router();

settlementRouter.use(AuthMiddleware.authenticateUser);

settlementRouter.get(
  "/calculate/:user2Id",
  SettlementController.calculateTotalSettlementWithUser
);
settlementRouter.get(
  "/:user2Id",
  SettlementController.getAllSettlementsWithUser
);
settlementRouter.post("/payment", SettlementController.addPayment);
settlementRouter.post("/receive", SettlementController.addReceive);
settlementRouter.delete("/:id", SettlementController.deletePayement);

export default settlementRouter;
