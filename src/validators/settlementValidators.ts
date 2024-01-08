import { body, ValidationChain } from "express-validator";

export const addPayementValidator: ValidationChain[] = [
  body("payeeId").isUUID().withMessage("Invalid payeeId"),
  body("amount").isFloat().withMessage("Invalid amount").toFloat(),
];
