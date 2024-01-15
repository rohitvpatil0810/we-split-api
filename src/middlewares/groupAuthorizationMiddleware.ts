import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import { groupAuthorizationMiddlewareValidator } from "../validators/groupValidators";
import { validationResult } from "express-validator";
import GroupMemberService from "../services/groupMemberService";

class GroupAuthorizationMiddleware {
  // Note: normal functions are modified to arrow functions for below reason

  // When a method is passed as a callback (as in middleware functions),
  // its context (this) can become detached from the instance of the class.
  // By binding the methods in the constructor, you are ensuring that the
  // context is explicitly set to the current instance of the class.
  // This is a common practice to avoid issues with the context being lost.
  //   constructor() {
  //     this.isUserGroupAdmin = this.isUserGroupAdmin.bind(this);
  //     this.isUserGroupMember = this.isUserGroupMember.bind(this);
  //   }

  private checkGroupId = async (
    req: AuthenticatedRequest
  ): Promise<boolean> => {
    await Promise.all(
      groupAuthorizationMiddlewareValidator.map((validator) =>
        validator.run(req)
      )
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return true;
    }
    return false;
  };

  isUserGroupAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (await this.checkGroupId(req)) {
        res.status(403).json({
          error: "Forbidden - Invalid GroupId",
        });
        return;
      }
      const groupId = req.params.groupId;
      if (req.user) {
        const isAdmin = await GroupMemberService.isGroupMember(
          groupId,
          req.user.id
        );
        if (!isAdmin) throw new Error("Forbidden");
        next();
      }
    } catch (error: any) {
      console.log("Group admin authentication error: ", error);
      if (error.message == "Forbidden") {
        res.status(403).json({
          error:
            "Sorry, only administrators have the privilege to perform this action.",
        });
      } else {
        res.status(500).json({
          error: "Internal server error.",
        });
      }
    }
  };

  isUserGroupMember = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (await this.checkGroupId(req)) {
        res.status(403).json({
          error: "Forbidden - Invalid GroupId",
        });
        return;
      }
      const groupId = req.params.groupId;
      if (req.user) {
        const isMember = await GroupMemberService.isGroupMember(
          groupId,
          req.user.id
        );
        if (!isMember) throw new Error("Forbidden");
        next();
      }
    } catch (error: any) {
      console.log("Group member authentication error: ", error);
      if (error.message == "Forbidden") {
        res.status(403).json({
          error: "You need to be a member of the group to perform this action.",
        });
      } else {
        res.status(500).json({
          error: "Internal server error.",
        });
      }
    }
  };
}

export default new GroupAuthorizationMiddleware();
