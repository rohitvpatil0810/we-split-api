import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware";
import GroupController from "../controllers/groupController";
import GroupAuthorizationMiddleware from "../middlewares/groupAuthorizationMiddleware";
const groupRouter = Router();

groupRouter.use(AuthMiddleware.authenticateUser);

// Group Creation
groupRouter.post("/create", GroupController.createGroup);

// groupRouter.use(GroupAuthorizationMiddleware.isUserGroupMember);
// Group Information
groupRouter.get(
  "/:groupId",
  GroupAuthorizationMiddleware.isUserGroupMember,
  GroupController.getGroup
);
// groupRouter.get("/:groupId/members", );
// groupRouter.get("/:groupId/expenses", );

// Group M<embership
// groupRouter.post("/:groupId/members")
// groupRouter.delete("/:groupId/members/:userId")

// Group Admninistration
// groupRouter.patch("/:groupId")
// groupRouter.delete("/:groupId")

export default groupRouter;
