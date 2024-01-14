import { Router } from "express";
import userRouter from "./userRoutes";
import authRouter from "./authRoutes";
import expenseRouter from "./expenseRoutes";
import settlementRouter from "./settlementRoutes";
import groupRouter from "./groupRoutes";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/expenses", expenseRouter);
router.use("/settlements", settlementRouter);
router.use("/groups", groupRouter);

export default router;
