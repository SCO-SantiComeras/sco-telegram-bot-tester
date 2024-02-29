import { SendMessage } from "../model/send-message";

export class SendMessageGroup {
    static readonly type = '[TelegramBotTester] Send message to telegram group';
    constructor(public payload: { sendMessage: SendMessage } ) {}
}