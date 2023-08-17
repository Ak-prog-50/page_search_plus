import { IUserDocument } from "../data-access/models/userModel";
import { TSaveUser } from "../data-access/user.db";
import { User } from "../domain/User";
import { UserAvatarService } from "../services/userAvatarService";
import { IinteractorReturn } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";

interface ICreateUserDB {
  saveUser: TSaveUser;
}

async function createUser(
  username: string,
  password: string,
  email: string,
  createUserDB: ICreateUserDB,
): Promise<IinteractorReturn<IUserDocument>> {
  const avatarUrl = await UserAvatarService.generateUserAvatar(email);

  const user = new User(username, email, avatarUrl);
  const createdUser: IUserDocument = await createUserDB.saveUser(user);
  return {
    appError: null,
    sucessData: createdUser,
  };
}

export { createUser };
