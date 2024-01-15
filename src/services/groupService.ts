import { Group, Prisma } from "@prisma/client";
import prisma from "../utils/prisma";
class GroupService {
  crateGroupInput(name: string, userId: string): Prisma.GroupCreateManyInput {
    const group: Prisma.GroupCreateManyInput = {
      name,
      createdBy: userId,
    };
    return group;
  }

  async getGroupByGroupId(groupId: string) {
    try {
      const group = await prisma.group.findFirstOrThrow({
        where: {
          id: groupId,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          createdByUser: {
            select: {
              username: true,
            },
          },
          updateByUser: {
            select: {
              username: true,
            },
          },
        },
      });
      return group;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        if ((error.code = "P2025")) throw new Error("No Group found");
        throw new Error("Failed to find group due to database error.");
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to find group.");
      }
    }
  }
}

export default new GroupService();
