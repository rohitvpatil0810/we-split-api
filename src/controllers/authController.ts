import { Request, Response } from "express";
import { loginValidator } from "../validators/authValidators";
import { validationResult } from "express-validator";
import authService from "../services/authService";

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      await Promise.all(loginValidator.map((validator) => validator.run(req)));

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      const { accessToken, refreshToken } = await authService.login(
        email,
        password
      );

      res.status(200).json({ accessToken, refreshToken });
    } catch (error: any) {
      console.log("Error login in user:", error.message);
      if (
        error.message == "Invalid Credentials" ||
        error.message == "No User found"
      ) {
        res.status(401).json({
          error: "Invalid Credentials",
        });
        return;
      }
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: "Refresh token is required" });
        return;
      }

      const newTokes = await authService.refreshToken(refreshToken);

      res.status(200).json({
        accessToken: newTokes.accessToken,
        refreshToken: newTokes.refreshToken,
      });
    } catch (error: any) {
      console.error("Error during refresh token:", error.message);

      if (error.message === "Invalid refresh token") {
        res.status(401).json({ error: "Invalid refresh token" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
}

export default new AuthController();
