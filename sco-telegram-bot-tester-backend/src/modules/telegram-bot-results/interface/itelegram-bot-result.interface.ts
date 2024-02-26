import { ObjectId } from "mongoose";

export interface ITelegramBotResult {
  _id?: string;
  user: ObjectId;
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
