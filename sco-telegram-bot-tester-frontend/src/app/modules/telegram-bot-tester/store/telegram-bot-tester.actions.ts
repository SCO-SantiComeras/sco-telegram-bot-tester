import { SendMessage } from "../model/send-message";

export class SendMessageGroup {
    static readonly type = '[TelegramBotTester] Send message to telegram group';
    constructor(public payload: { sendMessage: SendMessage } ) {}
}

export class SubscribeSendMessageGroupWS{
    static readonly type = '[TelegramBotTester] Subscribe send message group WS'
}

export class UnSubscribeSendMessageGroupWS {
    static readonly type = '[TelegramBotTester] UnSubscribe send message group WS';
}