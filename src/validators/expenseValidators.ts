import { body, ValidationChain } from "express-validator";

const gteValidator = (value: number, threshold: number) => value >= threshold;

export const createExpenseValidator: ValidationChain[] = [
  body("amount").isFloat({ gt: 0 }).withMessage("Invalid amount"),
  body("description")
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters long"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("At least one user should be present."),
  body("users.*.userId").notEmpty().withMessage("Userid missing"),
  body("users.*.share")
    .isFloat()
    .custom((value) => gteValidator(value, 0))
    .withMessage("Invalid share amount"),
  body("users.*.paidAmount")
    .isFloat()
    .custom((value) => gteValidator(value, 0))
    .withMessage("Invalid paid Amount"),
  body("users")
    .custom((users, { req }) => {
      const sumOfShares = users.reduce(
        (sum: any, user: any) => sum + parseFloat(user.share),
        0
      );
      return sumOfShares === parseFloat(req.body.amount);
    })
    .withMessage(
      "Sum of share amounts must be equal to the total expense amount"
    ),
  body("users")
    .custom((users, { req }) => {
      const sumOfPaidAmounts = users.reduce(
        (sum: any, user: any) => sum + parseFloat(user.paidAmount),
        0
      );
      return sumOfPaidAmounts === parseFloat(req.body.amount);
    })
    .withMessage(
      "Sum of paid amounts must be equal to the total expense amount"
    ),
];
