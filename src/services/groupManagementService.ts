import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";
import GroupService from "./groupService";
import GroupMemberService from "./groupMemberService";

class GroupManagementService {
  async createGroup(name: string, users: Array<string>, userId: string) {
    try {
      const group = await prisma.$transaction(async (tx) => {
        const groupInput = GroupService.crateGroupInput(name, userId);
        const group = await tx.group.create({
          data: groupInput,
        });

        const groupMembersInput = GroupMemberService.createGroupMembersInput(
          group.id,
          users,
          userId
        );

        const groupMembers = await tx.groupMember.createMany({
          data: groupMembersInput,
        });

        return group;
      });
      return group;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error("Failed to create group due to database error.");
      }
      console.log("Failed to add Expense:", error.message);
      throw new Error("Failed to create group.");
    }
  }
}

export default new GroupManagementService();
