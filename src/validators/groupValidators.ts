import { body, ValidationChain } from "express-validator";

export const createGroupValidator: ValidationChain[] = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Group name must be at least 3 characters long"),
  body("users").isArray().withMessage("Invalid users"),
  body("users.*").isUUID().withMessage("Invalid userId"),
];
