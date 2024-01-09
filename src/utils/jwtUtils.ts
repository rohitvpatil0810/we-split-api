import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import userService from "../services/userService";

class JwtUtils {
  refreshTokenSecret: string =
    process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret";
  refreshTokenExpiration: string =
    process.env.REFRESH_TOKEN_EXPIRATION || "15d";
  accessTokenSecret: string =
    process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret";
  accessTokenExpiration: string = process.env.ACCESS_TOKEN_EXPIRATION || "8hr";

  private generateToken(user: User, secret: string, expiresIn: string): string {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    return jwt.sign(payload, secret, { expiresIn });
  }

  generateRefreshToken(user: User): string {
    return this.generateToken(
      user,
      this.refreshTokenSecret,
      this.refreshTokenExpiration
    );
  }

  generateAccessToken(user: User): string {
    return this.generateToken(
      user,
      this.accessTokenSecret,
      this.accessTokenExpiration
    );
  }

  private async verify(token: string, secret: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, secret) as { userId: string };
      const userId = decoded.userId;

      const user = await userService.getUserById(userId);
      return user;
    } catch (error: any) {
      return null;
    }
  }

  async verifyAccessToken(token: string): Promise<User | null> {
    return this.verify(token, this.accessTokenSecret);
  }

  async verfiyRefreshToken(token: string): Promise<User | null> {
    return this.verify(token, this.refreshTokenSecret);
  }
}

export default new JwtUtils();
