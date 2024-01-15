import { GroupMemberTypes, Prisma } from "@prisma/client";

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
}

export default new GroupMemberService();
