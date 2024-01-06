import { Router } from "express";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
