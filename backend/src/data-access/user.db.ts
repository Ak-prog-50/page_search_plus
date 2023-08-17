import { IUserDocument, UserModel } from "./models/userModel";
import { User } from "../domain/User";

type TSaveUser = (user: User) => Promise<IUserDocument>;

const saveUser: TSaveUser = async function (user) {
  const { userName, email } = user;
  const createdUser = new UserModel({
    userName,
    email,
    // etc..
  });
  return await createdUser.save();
};

export { saveUser, TSaveUser };
