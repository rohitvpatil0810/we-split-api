import { Prisma, User } from "@prisma/client";
import passwordUtils from "../utils/passwordUtils";
import prisma from "../utils/prisma";

class UserService {
  async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        throw new Error("Account Already Exists");
      }

      const hashedPassword = await passwordUtils.hashPassword(password);

      const user: User = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error("Failed to create user due to database error.");
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to create user.");
      }
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      return user;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        if ((error.code = "P2025")) throw new Error("No User found");
        throw new Error("Failed to find user due to database error.");
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to create user.");
      }
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email: email,
        },
      });

      return user;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        if ((error.code = "P2025")) throw new Error("No User found");
        throw new Error("Failed to find user due to database error.");
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to create user.");
      }
    }
  }
}

export default new UserService();
