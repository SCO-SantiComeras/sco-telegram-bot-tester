export class User {
  _id?: string;
  name: string;
  password?: string;
  newPassword?: string;
  email: string;
  active?: boolean;
  role?: string;
  pwdRecoveryToken?: string;
  pwdRecoveryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  typeObj?: string;

  constructor() {
    this._id = undefined;
    this.name = undefined;
    this.password = undefined;
    this.newPassword = undefined;
    this.email = undefined;
    this.active = false;
    this.role = undefined;
    this.pwdRecoveryToken = undefined;
    this.pwdRecoveryDate = undefined;
    this.createdAt = undefined;
    this.updatedAt = undefined;
    this.typeObj = 'User';
  }
}
