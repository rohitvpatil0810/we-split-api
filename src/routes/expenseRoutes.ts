import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware";
import ExpenseController from "../controllers/expenseController";
const expenseRouter = Router();

expenseRouter.use(AuthMiddleware.authenticateUser);
expenseRouter.get("/user", ExpenseController.getUserExpenses);
expenseRouter.post("/create", ExpenseController.createExpense);
expenseRouter.delete("/:id", ExpenseController.deleteExpense);
expenseRouter.patch("/:id", ExpenseController.updateExpense);

export default expenseRouter;
