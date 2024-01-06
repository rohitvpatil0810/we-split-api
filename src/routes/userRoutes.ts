import { Router } from "express";
import userController from "../controllers/userController";

const userRouter = Router();

userRouter.post("/register", userController.createUser);
userRouter.get("/:userId", userController.findUserById);

export default userRouter;
