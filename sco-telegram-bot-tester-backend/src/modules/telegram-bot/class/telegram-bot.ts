
import * as Telegram from 'node-telegram-bot-api';

export class TelegramBot {
    token: string;
    bot: any;

    constructor(token: string) {
        this.token = token;
        this.bot = new Telegram(token, { polling: false }); // Polling true will autostart bot instance
    }
}