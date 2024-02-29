import { Injectable } from "@nestjs/common";
import { IUser } from "src/modules/users/interface/iuser.interface";
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {

  constructor() { }

  public async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  public async comparePasswords(password: string, user: IUser): Promise<boolean> {
    let validPassword: boolean = false;
    
    try {
      validPassword = await bcrypt.compare(password, user.password);
    } catch (error) {
      console.log(`[comparePasswords] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }

    return validPassword;
  }

  public async generateToken(tokenLength = 32) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < tokenLength; i++) 
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}
