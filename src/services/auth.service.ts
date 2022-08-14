import { compare, hash } from 'bcrypt';
import { injectable } from 'inversify';
import { generate } from 'shortid';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../helpers/token.helper';
import { IUser, User } from '../models/user.model';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

@injectable()
export class AuthService {
  private async hashPassword(password: string) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
  }

  public async getById(id: string) {
    const user = await User.findOne({ userId: id });
    return user;
  }

  public async getByEmail(email: string) {
    const user = await User.findOne<IUser>({ email });
    return user;
  }

  public async create(payload: RegisterPayload) {
    const {
      username,
      email,
      password,
    } = payload;
    const userResponse = await this.getByEmail(email);
    if (userResponse) {
      throw new Error('User already exists');
    }
    const hashedPassword = await this.hashPassword(password);
    const userId = `user_${generate()}`;
    const user = await User.create({
      userId,
      username,
      email,
      password: hashedPassword,
    });

    return user;
  }

  private async comparePasswords(password: string, userPassword: string): Promise<boolean> {
    return compare(password, userPassword);
  }

  public async verify({
    email,
    password,
  }: {
    email: string,
    password: string,
  }) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const validUser = await this.comparePasswords(password, user.password);
    if (!validUser) {
      throw new Error('Invalid Password');
    }
    const accessToken = createAccessToken({
      userId: user.userId,
    }, '1h');
    const refreshToken = createRefreshToken({
      userId: user.userId,
    }, '7d');
    this.updateUser(user.userId, { refreshToken });
    return {
      accessToken,
      refreshToken,
    };
  }

  public async refresh(userId: string) {
    const userInfo = await this.getById(userId);
    if (!userInfo?.refreshToken) {
      return null;
    }
    const validToken = verifyRefreshToken(userInfo?.refreshToken);
    if (!validToken) {
      return null;
    }
    return createAccessToken({ userId }, '1h');
  }

  private updateUser(userId: string, updatedUser: Partial<IUser>) {
    return User.updateOne({ userId }, updatedUser).exec();
  }
}
