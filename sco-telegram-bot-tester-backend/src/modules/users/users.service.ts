import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { IUser } from './interface/iuser.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { usersConstants } from './constants/user.constants';
import { ConfigService } from '@nestjs/config';
import { RoleConstants } from './constants/role.constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject('MODEL') private readonly UserModel: Model<IUser>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get('app.population')) {
      await this.populatePublicUser();
      await this.populateAdminUser();
    }
  }

  async fetchUsers(where?: any): Promise<IUser[]> {
    try {
      return await this.UserModel.find(where, { password: 0 });
    } catch (error) {
      console.log(`[fetchAllUsers] Error: ${JSON.stringify(error)}`);
      return [];
    }
  }

  async addUser(user: UserDto): Promise<IUser> {
    try {
      const userModel = new this.UserModel({
        name: user.name,
        password: user.password,
        email: user.email,
        active: user.active != undefined ? user.active : false,
        role: user.role ? user.role : RoleConstants.USER,
        pwdRecoveryToken: undefined,
        pwdRecoveryDate: undefined,
      });

      const savedUser: IUser = await userModel.save();
      if (!savedUser) {
        console.log(`[addUser] User: ${savedUser.name} unnable to create`);
        return undefined;
      }
      console.log(`[addUser] User: ${savedUser.name} created successfully`);

      savedUser.password = undefined;
      return savedUser;
    } catch (error) {
      console.log(`[addUser] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async updateUser(_id: string, user: UpdateUserDto, updatePassword: boolean = false): Promise<IUser> {
    const set: any = {
      name: user.name,
      email: user.email,
      active: user.active,
      role: user.role,
      pwdRecoveryToken: user.pwdRecoveryToken,
      pwdRecoveryDate: user.pwdRecoveryDate,
    }

    if (updatePassword) {
      set.password = user.password;
    }

    try {
      const result = await this.UserModel.updateOne(
        {
          _id: _id,
        },
        { 
          $set: set
        }
      );

      if (!result || (result && result.nModified != 1)) {
        console.log(`[updateUser] User: ${_id} unnable to update`);
        return undefined;
      }
      console.log(`[updateUser] User: ${_id} updated successfully`);

      return await this.findUser(_id);
    } catch (error) {
      console.log(`[updateUser] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async deleteUser(name: string): Promise<boolean> {
    try {
      const result = await this.UserModel.deleteOne({ name });

      if (!result || (result && result.deletedCount != 1)) {
        console.log(`[deleteUser] User: ${name} unnable to delete`);
        return false;
      }
      console.log(`[deleteUser] User: ${name} deleted successfully`);

      return true;
    } catch (error) {
      console.log(`[deleteUser] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async findUser(_id: string): Promise<IUser> {
    try {
      return await this.UserModel.findOne({ _id: _id });
    } catch (error) {
      console.log(`[findUser] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async findUserByName(name: string): Promise<IUser> {
    try {
      return await this.UserModel.findOne({ name: name });
    } catch (error) {
      console.log(`[findUserByName] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async findUserByEmail(email: string): Promise<IUser> {
    try {
      return await this.UserModel.findOne({ email: email });
    } catch (error) {
      console.log(`[findUserByEmail] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async findUsersByRole(role: string): Promise<IUser[]> {
    try {
      return await this.UserModel.find({ role: role });
    } catch (error) {
      console.log(`[findUsersByRole] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async modelToDto(user: IUser): Promise<UserDto> {
    const UserDto: UserDto = {
      _id: user._id ? user._id : undefined, 
      name: user.name,
      password: user.password ? user.password : undefined,
      email: user.email,
      active: user.active,
      role: user.role,
      pwdRecoveryToken: user.pwdRecoveryToken,
      pwdRecoveryDate: user.pwdRecoveryDate,
      typeObj: user.typeObj ? user.typeObj : 'User', 
    }

    return UserDto;
  }

  private async populatePublicUser() {
    const existPublicUser: IUser = await this.findUserByName(usersConstants.PUBLIC.NAME);
    if (existPublicUser) {
      return;
    }

    const userPublicDto: UserDto = {
      name: usersConstants.PUBLIC.NAME,
      password: usersConstants.PUBLIC.PASSWORD,
      email: usersConstants.PUBLIC.EMAIL,
      active: usersConstants.PUBLIC.ACTIVE,
      role: usersConstants.PUBLIC.ROLE,
    }

    const createdPublicUser: IUser = await this.addUser(userPublicDto);
    if (!createdPublicUser) {
      console.log(`[populatePublicUser] Unnable to create '${usersConstants.PUBLIC.NAME}' user`);
      return;
    }
    
    console.log(`[populatePublicUser] User '${usersConstants.PUBLIC.NAME}' added successfully`);
  }

  private async populateAdminUser() {
    const existAdminUser: IUser = await this.findUserByName(usersConstants.ADMIN.NAME);
    if (existAdminUser) {
      return;
    }

    const userAdminDto: UserDto = {
      name: usersConstants.ADMIN.NAME,
      password: usersConstants.ADMIN.PASSWORD,
      email: usersConstants.ADMIN.EMAIL,
      active: usersConstants.ADMIN.ACTIVE,
      role: usersConstants.ADMIN.ROLE,
    }

    const createdAdmminUser: IUser = await this.addUser(userAdminDto);
    if (!createdAdmminUser) {
      console.log(`[populateAdminUser] Unnable to create '${usersConstants.ADMIN.NAME}' user`);
      return;
    }
    
    console.log(`[populateAdminUser] User '${usersConstants.ADMIN.NAME}' added successfully`);
  }
}
