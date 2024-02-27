export class User {
  _id?: string;
  name: string;
  password?: string;
  newPassword?: string;
  email: string;
  active?: boolean;
  pwdRecoveryToken?: string;
  pwdRecoveryDate?: Date;
  typeObj?: string;

  constructor(name: string, password: string, email: string, active: boolean) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.active = active;
    this.pwdRecoveryToken = undefined;
    this.pwdRecoveryDate = undefined;
  }
}
