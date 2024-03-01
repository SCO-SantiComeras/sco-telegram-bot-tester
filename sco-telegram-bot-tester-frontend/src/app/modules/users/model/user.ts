import { RoleConstants } from '../../../../../../sco-telegram-bot-tester-backend/src/modules/users/constants/role.constants';

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

  constructor(name: string, password: string, email: string, active: boolean, role: string = RoleConstants.USER) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.active = active;
    this.role = role;
    this.pwdRecoveryToken = undefined;
    this.pwdRecoveryDate = undefined;
  }
}
