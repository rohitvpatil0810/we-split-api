import { GroupMemberTypes, Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

class GroupMemberService {
  createGroupMembersInput(
    groupId: string,
    users: Array<string>,
    userId: string
  ): Prisma.GroupMemberCreateManyInput[] {
    const members: Prisma.GroupMemberCreateManyInput[] = users.map((user) => ({
      userId: user,
      groupId,
    }));
    members.push({
      groupId,
      userId,
      role: GroupMemberTypes.ADMIN,
    });
    return members;
  }

  private async checkGroupRole(
    groupId: string,
    userId: string,
    roles: GroupMemberTypes[]
  ): Promise<boolean> {
    try {
      const groupMember = await prisma.groupMember.findFirst({
        where: {
          groupId,
          userId,
          isDeleted: false,
          OR: roles.map((role) => ({ role: role })),
        },
      });
      if (groupMember) return true;
      return false;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          "Failed to find group membership due to database error."
        );
      } else {
        console.error("Failed to find group membership:", error.message);
        throw new Error("Failed to find group membership.");
      }
    }
  }

  async isGroupAdmin(groupId: string, userId: string): Promise<boolean> {
    try {
      const isAdmin = await this.checkGroupRole(groupId, userId, [
        GroupMemberTypes.ADMIN,
      ]);
      if (isAdmin) return true;
      return false;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error("Failed to check group admin due to database error.");
      } else {
        console.error("Failed to check group admin:", error.message);
        throw new Error("Failed to check group admin.");
      }
    }
  }

  async isGroupMember(groupId: string, userId: string): Promise<boolean> {
    try {
      const isMember = await this.checkGroupRole(groupId, userId, [
        GroupMemberTypes.ADMIN,
        GroupMemberTypes.MEMBER,
      ]);
      if (isMember) return true;
      return false;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error("Failed to check group member due to database error.");
      } else {
        console.error("Failed to check group admin:", error.message);
        throw new Error("Failed to check group member.");
      }
    }
  }
}

export default new GroupMemberService();
