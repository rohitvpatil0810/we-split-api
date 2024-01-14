import { Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import { createGroupValidator } from "../validators/groupValidators";
import { validationResult } from "express-validator";
import GroupManagementService from "../services/groupManagementService";

class GroupController {
  async createGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await Promise.all(
        createGroupValidator.map((validator) => validator.run(req))
      );
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
        });
        return;
      }

      const { name, users } = req.body;
      if (req.user) {
        const group = await GroupManagementService.createGroup(
          name,
          users,
          req.user.id
        );
        res.status(200).json({
          group,
        });
      }
    } catch (error: any) {
      console.log("Error while creating group:", error.message);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}

export default new GroupController();
