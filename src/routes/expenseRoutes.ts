import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware";
import ExpenseController from "../controllers/expenseController";
const expenseRouter = Router();

expenseRouter.use(AuthMiddleware.authenticateUser);
expenseRouter.post("/create", ExpenseController.createExpense);

export default expenseRouter;
