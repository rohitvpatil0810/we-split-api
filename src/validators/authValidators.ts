import { body, ValidationChain } from "express-validator";

export const loginValidator: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").isLength({ min: 1 }).withMessage("Password is required"),
];
