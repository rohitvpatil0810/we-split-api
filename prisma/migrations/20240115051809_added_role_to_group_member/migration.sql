-- CreateEnum
CREATE TYPE "GroupMemberTypes" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "GroupMember" ADD COLUMN     "role" "GroupMemberTypes" NOT NULL DEFAULT 'MEMBER';
