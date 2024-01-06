import bcrypt from "bcrypt";

const saltRounds = 10;

class PasswordUtils {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

const passwordUtils = new PasswordUtils();

export default passwordUtils;
