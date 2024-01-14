import { Prisma } from "@prisma/client";

class GroupService {
  crateGroupInput(name: string, userId: string): Prisma.GroupCreateManyInput {
    const group: Prisma.GroupCreateManyInput = {
      name,
      createdBy: userId,
    };
    return group;
  }
}

export default new GroupService();
