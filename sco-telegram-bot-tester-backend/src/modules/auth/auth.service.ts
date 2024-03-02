import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/interface/iuser.interface';
import { Token } from './class/token';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(user: IUser): Promise<Token> {
    const payload: JwtPayload = { name: user.name };
    let token: Token = undefined;

    try {
      const accessToken: string = this.jwtService.sign(payload, { 
        secret: this.configService.get('auth.secret'),
        expiresIn: this.configService.get('auth.expiresIn'),
        algorithm: this.configService.get('auth.algorithm'),
      });

      if (accessToken) {
        const userDto: UserDto = await this.usersService.modelToDto(user);
        token = new Token(accessToken, 'jwt', userDto);
      }
    } catch (error) {
      console.log(`[generateToken] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
    
    return token;
  }

  async validateAccessToken(req: Request): Promise<boolean> {
    if (!req || (req && !req.headers) || (req && req.headers && !req.headers.authorization)) {
      return false;
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    if(!accessToken) {
      return false;
    }

    let decodedToken = undefined;
    try {
      decodedToken = this.jwtService.verify(accessToken, { 
        secret: this.configService.get('auth.secret'),
      });
    } catch (error) {
      decodedToken = undefined;
    }

    if (!decodedToken) {
      return false;
    }

    const existUser = await this.usersService.findUserByName(decodedToken.name);
    if (!existUser) {
      return false;
    }

    return true;
  };
}
