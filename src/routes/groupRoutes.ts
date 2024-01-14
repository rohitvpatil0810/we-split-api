import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware";
import GroupController from "../controllers/groupController";
const groupRouter = Router();

groupRouter.use(AuthMiddleware.authenticateUser);

groupRouter.post("/create", GroupController.createGroup);

export default groupRouter;
