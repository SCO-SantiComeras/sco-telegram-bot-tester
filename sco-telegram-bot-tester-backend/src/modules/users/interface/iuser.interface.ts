export interface IUser {
  _id?: string;
  name: string;
  password: string;
  email: string;
  active?: boolean;
  role: string;
  pwdRecoveryToken?: string;
  pwdRecoveryDate?: Date;
  typeObj?: string;
}
