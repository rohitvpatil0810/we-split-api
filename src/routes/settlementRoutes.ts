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

export default settlementRouter;
