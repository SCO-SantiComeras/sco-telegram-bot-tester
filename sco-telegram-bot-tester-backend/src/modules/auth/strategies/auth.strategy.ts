import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUser } from '../../users/interface/iuser.interface';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { httpErrorMessages } from '../../../constants/http-error-messages.constants';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<IUser> {
    const user = await this.usersService.findUserByName(payload.name);
    if (!user) {
      console.log(`[Jwt Strategy Validate] User '${payload.name} is not authorized`);
      throw new HttpException(httpErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
