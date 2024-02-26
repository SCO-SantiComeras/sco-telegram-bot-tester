import { UserDto } from '../../users/dto/user.dto';

export class Token {

  accessToken: string;
  tokenType: string;
  user: UserDto;

  constructor(accessToken: string, type: string, user: UserDto) {
    this.accessToken = accessToken;
    this.tokenType = type;
    this.user = user;
  }
}
