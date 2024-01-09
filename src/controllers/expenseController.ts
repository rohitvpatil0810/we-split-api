import { Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import { createExpenseValidator } from "../validators/expenseValidators";
import { validationResult } from "express-validator";
import ExpenseManagementService from "../services/expenseManagementService";
import ExpenseParticipantService from "../services/expenseParticipantService";

class ExpenseController {
  async createExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await Promise.all(
        createExpenseValidator.map((validator) => validator.run(req))
      );

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
        });
        return;
      }
      const { amount, description, users } = req.body;
      if (req.user) {
        const expense = await ExpenseManagementService.addExpense(
          amount,
          description,
          users,
          req.user.id
        );
        res.status(200).json({
          expense,
        });
      } else {
        throw new Error("Something Went Wrong");
      }
    } catch (error: any) {
      console.log("Error while adding expense:", error.message);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  async getUserExpenses(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (req.user) {
        const userExpenses =
          await ExpenseParticipantService.getExpenseParticipantByUserId(
            req.user?.id
          );
        res.status(200).json({
          userExpenses,
        });
      }
    } catch (error: any) {
      console.log("Error getting user expenses:", error.message);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async deleteExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const expenseId = req.params.id;
      if (!expenseId) {
        res.status(400).json({
          error: "Expense id is required",
        });
      }
      if (req.user) {
        const deletedExpense = await ExpenseManagementService.deleteExpense(
          expenseId,
          req.user?.id
        );
        res.status(200).json({
          deletedExpense,
        });
      }
    } catch (error: any) {
      console.log("Error getting user expenses:", error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

export default new ExpenseController();
