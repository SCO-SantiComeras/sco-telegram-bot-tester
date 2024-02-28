import { User } from "../../auth/model/user";

export class SendMessage {
    token: string;
    chat_id: string;
    text: string;
    user?: User;
}