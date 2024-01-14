import { RevokedRefreshToken, User } from "@prisma/client";
import jwtUtils from "../utils/jwtUtils";
import passwordUtils from "../utils/passwordUtils";
import userService from "./userService";
import RevokedRefreshTokenService from "./revokedRefreshTokenService";
class AuthService {
  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await userService.getUserByEmail(email);

      const isPasswordValid = await passwordUtils.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) throw new Error("Invalid Credentials");

      const accessToken = jwtUtils.generateAccessToken(user);
      const refreshToken = jwtUtils.generateRefreshToken(user);

      return { accessToken, refreshToken };
    } catch (error: any) {
      console.log("Error while login:", error.message);
      throw new Error(error.message);
    }
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const isRevokedRefreshToken: RevokedRefreshToken | null =
        await RevokedRefreshTokenService.getRevokedRefreshTokenByToken(
          refreshToken
        );

      if (isRevokedRefreshToken) throw new Error("Invalid refresh token");

      const user = await jwtUtils.verfiyRefreshToken(refreshToken);
      if (!user) {
        throw new Error("Invalid refresh token");
      }

      const accessToken = jwtUtils.generateAccessToken(user);
      const newRefreshToken = jwtUtils.generateRefreshToken(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      console.log("Error while refreshing token:", error.message);
      throw new Error(error.message);
    }
  }

  async logout(refreshToken: string): Promise<RevokedRefreshToken> {
    try {
      const revokedRefreshToken: RevokedRefreshToken =
        await RevokedRefreshTokenService.createRevodkedRefreshTokens(
          refreshToken
        );

      return revokedRefreshToken;
    } catch (error: any) {
      console.log("Error while logging out:", error.message);
      throw new Error(error.message);
    }
  }
}

export default new AuthService();
