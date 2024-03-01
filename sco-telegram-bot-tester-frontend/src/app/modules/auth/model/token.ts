import { User } from "../../users/model/user";

export class Token {
  accessToken: string;
  tokenType: string;
  user: User;
}
