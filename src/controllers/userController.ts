import { Request, Response } from "express";
import { createUserValidator } from "../validators/userValidators";
import { validationResult } from "express-validator";
import userService from "../services/userService";
import { User } from "@prisma/client";

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      await Promise.all(
        createUserValidator.map((validator) => validator.run(req))
      );

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email, password } = req.body;

      const newUser: User = await userService.createUser(
        username,
        email,
        password
      );

      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    } catch (error: any) {
      console.error("Error creating user:", error.message);

      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  async findUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;

      if (!userId) {
        res.status(400).json({
          error: "User ID is required",
        });
        return;
      }

      const user: User = await userService.getUserById(userId);

      res.status(200).json({
        user: user,
      });
    } catch (error: any) {
      console.error("Error finding user by ID:", error.message);

      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}

export default new UserController();
