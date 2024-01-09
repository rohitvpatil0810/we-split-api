import { body, param, ValidationChain } from "express-validator";

export const addPayementValidator: ValidationChain[] = [
  body("payeeId").isUUID().withMessage("Invalid payeeId"),
  body("amount").isFloat().withMessage("Invalid amount").toFloat(),
];

export const addReceiveValidator: ValidationChain[] = [
  body("payerId").isUUID().withMessage("Invalid payerId"),
  body("amount").isFloat().withMessage("Invalid amount").toFloat(),
];

export const updatePaymentValidator: ValidationChain[] = [
  param("id").isUUID().withMessage("Settlement id is required"),
  body("version").isNumeric().withMessage("Invalid version").toInt(),
  body("amount").isFloat().withMessage("Invalid amount").toFloat(),
];
