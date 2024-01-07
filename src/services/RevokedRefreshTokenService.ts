import { Prisma, RevokedRefreshToken } from "@prisma/client";
import prisma from "../utils/prisma";

class RevokedRefreshTokenService {
  async createRevodkedRefreshTokens(
    refreshToken: string
  ): Promise<RevokedRefreshToken> {
    try {
      const revokedRefreshToken: RevokedRefreshToken =
        await prisma.revokedRefreshToken.create({
          data: {
            token: refreshToken,
          },
        });
      return revokedRefreshToken;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error(
          "Failed to add revoked refresh token due to database error."
        );
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to add revoked refresh token");
      }
    }
  }

  async getRevokedRefreshTokenById(
    refreshToken: string
  ): Promise<RevokedRefreshToken | null> {
    try {
      const revokedRefreshToken: RevokedRefreshToken | null =
        await prisma.revokedRefreshToken.findFirst({
          where: { token: refreshToken },
        });

      return revokedRefreshToken;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", error.message);
        throw new Error(
          "Failed to get revoked refresh token due to database error."
        );
      } else {
        console.error("Generic Error:", error.message);
        throw new Error("Failed to get revoked refresh token.");
      }
    }
  }
}

export default new RevokedRefreshTokenService();
