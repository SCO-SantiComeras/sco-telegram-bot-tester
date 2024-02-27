import { SendMessage } from "../../telegram-bot-tester/model/send-message";
import { TelegramBotResult } from "../model/telegram-bot-result";

export class SendMessageGroup {
    static readonly type = '[TelegramBotTester] Send message to telegram group';
    constructor(public payload: { sendMessage: SendMessage } ) {}
}

export class FetchTelegramBotResults {
    static readonly type = '[TelegramBotResults] Fetch telegram bot results';
    constructor(public payload: { filter?: any }) {}
}

export class AddTelegramBotResult {
    static readonly type = '[TelegramBotResults] Add telegram bot results';
    constructor(public payload: { telegramBotResult: TelegramBotResult } ) {}
}

export class DeleteTelegramBotResult {
    static readonly type = '[TelegramBotResults] Delete telegram bot results';
    constructor(public payload: { _id: string } ) {}
}

export class SubscribeTelegramBotResultsWS {
    static readonly type = '[TelegramBotResults] Subscribe telegram bot results WS'
}

export class UnSubscribeTelegramBotResultsWS {
    static readonly type = '[TelegramBotResults] UnSubscribe telegram bot results WS';
}