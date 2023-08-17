import { Document, Model, model, Schema } from "mongoose";
import { User } from "../../domain/User";

interface IUserDocument extends User, Document {}

const userSchema: Schema<IUserDocument> = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

// type TUserDocument = InferSchemaType<typeof userSchema>;

const UserModel: Model<IUserDocument> = model<IUserDocument>(
  "User",
  userSchema,
);

export { IUserDocument, UserModel };
