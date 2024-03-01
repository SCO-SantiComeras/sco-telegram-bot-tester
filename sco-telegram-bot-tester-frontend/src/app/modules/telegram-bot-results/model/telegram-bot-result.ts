import { User } from "../../users/model/user";

export class TelegramBotResult {
  _id?: string;
  user: User;
  token: string;
  chat_id: string;
  text: string;
  success: boolean;
  errorCode?: number;
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  typeObj?: string;
}
