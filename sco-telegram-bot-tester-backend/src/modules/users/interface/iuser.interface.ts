import { ObjectId } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  password: string;
  email: string;
  active?: boolean;
  pwdRecoveryToken?: string;
  pwdRecoveryDate?: Date;
  typeObj?: string;
}
