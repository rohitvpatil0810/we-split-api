import { NextFunction, Request, Response } from "express";
import jwtUtils from "../utils/jwtUtils";
import { User } from "@prisma/client";
import { AuthenticatedRequest } from "../types/types";

class AuthMiddleware {
  async authenticateUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({
          error: "Unauthorized - Token missing",
        });
        return;
      }

      const user: User | null = await jwtUtils.verfiyRefreshToken(token);
      if (!user) throw Error("User not found");
      req.user = user;

      next();
    } catch (error) {
      console.log("Authentication error:", error);
      res.status(401).json({
        error: "Unathorized - Invalid token",
      });
    }
  }
}

export default new AuthMiddleware();
