import { httpErrorMessages } from './../../constants/http-error-messages.constants';
import { Injectable } from '@nestjs/common';
import { TelegramBot } from './class/telegram-bot';

@Injectable()
export class TelegramBotService {

  public async initializeBot(token: string): Promise<TelegramBot> {
    return new TelegramBot(token);
  }

  public async stopBot(telegramBot: TelegramBot): Promise<boolean> {
    const botStopped: boolean = await telegramBot.bot.stopPolling()
      .then(() => {
        return true;
      })
      .catch(() => {
        console.log(`[sendMessageGroup] Unnable to stop bot instance`);
        return false;
      });

    return botStopped;
  }

  public getErrorCode(error: string): number {
    if (!error || error.length == 0) return 500;

    const errorSplit: string[] = error.split(':');
    const spaceSplit: string[] = errorSplit[1].split(' ');
    return Number.parseInt(spaceSplit[1]);
  }

  public getErrorType(error: string): string {
    if (!error || error.length == 0) return '';

    const errorSplit: string[] = error.split(':');
    return errorSplit[0];
  }

  public formatError(code: number): string {
    switch(code) {
      case 401: 
        return httpErrorMessages.TELEGRAM_BOT_TESTER.BOT_TOKEN_UNAUTHORIZED;
      case 404:
        return httpErrorMessages.TELEGRAM_BOT_TESTER.BOT_TOKEN_NOT_FOUND;
      case 400:
        return httpErrorMessages.TELEGRAM_BOT_TESTER.CHAT_ID_NOT_FOUND;
      case 403:
        return httpErrorMessages.TELEGRAM_BOT_TESTER.CHAT_GROUP_DELETE;
      default: 
        return '';
    }
  }
}