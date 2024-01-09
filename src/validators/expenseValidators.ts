import { body, param, ValidationChain } from "express-validator";

const gteValidator = (value: number, threshold: number) => value >= threshold;

export const createExpenseValidator: ValidationChain[] = [
  body("amount").isFloat({ gt: 0 }).withMessage("Invalid amount").toFloat(),
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
    .withMessage("Invalid share amount")
    .toFloat(),
  body("users.*.amountPaid")
    .isFloat()
    .custom((value) => gteValidator(value, 0))
    .withMessage("Invalid paid Amount")
    .toFloat(),
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
        (sum: any, user: any) => sum + parseFloat(user.amountPaid),
        0
      );
      return sumOfPaidAmounts === parseFloat(req.body.amount);
    })
    .withMessage(
      "Sum of paid amounts must be equal to the total expense amount"
    ),
];

export const updateExpenseValidator: ValidationChain[] = [
  param("id").isUUID().withMessage("Expense id is required"),
  body("version").isNumeric().withMessage("Invalid version").toInt(),
  body("amount").isFloat({ gt: 0 }).withMessage("Invalid amount").toFloat(),
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
    .withMessage("Invalid share amount")
    .toFloat(),
  body("users.*.amountPaid")
    .isFloat()
    .custom((value) => gteValidator(value, 0))
    .withMessage("Invalid paid Amount")
    .toFloat(),
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
        (sum: any, user: any) => sum + parseFloat(user.amountPaid),
        0
      );
      return sumOfPaidAmounts === parseFloat(req.body.amount);
    })
    .withMessage(
      "Sum of paid amounts must be equal to the total expense amount"
    ),
];
