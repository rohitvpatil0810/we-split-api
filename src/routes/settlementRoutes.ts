import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware";
import SettlementController from "../controllers/settlementController";

const settlementRouter = Router();

settlementRouter.use(AuthMiddleware.authenticateUser);

settlementRouter.get(
  "/calculate/:user2Id",
  SettlementController.calculateTotalSettlementAmount
);
// settlementRouter.get("/:user2Id", )

export default settlementRouter;
