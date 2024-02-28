import { httpErrorMessages } from './../../constants/http-error-messages.constants';
import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Response } from 'express';
import { TelegramBot } from './class/telegram-bot';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { websocketEvents } from '../websocket/constants/websocket.events';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/interface/iuser.interface';
import { TelegramBotResultDto } from '../telegram-bot-results/dto/telegram-bot-result.dto';
import { TelegramBotResultsService } from '../telegram-bot-results/telegram-bot-results.service';
import { ITelegramBotResult } from '../telegram-bot-results/interface/itelegram-bot-result.interface';

@Controller('api/v1/telegram-bot')
export class TelegramBotController {

  constructor(
    private readonly telegramBotService: TelegramBotService,
    private readonly websocketsService: WebsocketGateway,
    private readonly usersService: UsersService,
    private readonly telegramBotResultsService: TelegramBotResultsService,
  ) {}

  @Post('send-message-group')
  @ApiOperation({
    summary: `Send Message Group`,
    description: 'Send a telegram message to group',
  })
  @ApiBody({
    description: 'Example of send a telegram message to group',
    type: SendMessageDto,
    examples: {
      sendMessageGroup: {
        value: {
          token: '5005652633:AAF_Yik_jDa1Vj-to79OGJkJbTXE_FYjsvk',
          chat_id: '-4173364857',
          text: 'Telegram Bot Tester Mock Message',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Message send successfully, returns a boolean value',
  })
  @ApiResponse({
    status: 401,
    description: 'Bot token unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Message text is empty',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 404,
    description: 'Bot token not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to create telegram bot',
  })
  async sendMessageGroup(
    @Res() res: Response,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<Response<boolean, Record<string, boolean>>> {
    console.log(`[sendMessageGroup] Start: chat id '${sendMessageDto.chat_id}', token '${sendMessageDto.token}'`);

    if (sendMessageDto.user) {
      const existUser: IUser = await this.usersService.findUserByEmail(sendMessageDto.user.email);
      if (!existUser) {
        console.log(`[sendMessageGroup] ${httpErrorMessages.USERS.USER_NOT_FOUND}`);
        throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    }

    const telegramBot: TelegramBot = await this.telegramBotService.initializeBot(sendMessageDto.token);
    if (!telegramBot) {
      console.log(`[sendMessageGroup] ${httpErrorMessages.TELEGRAM_BOT_TESTER.UNNABLE_CREATE_TELEGRAM_BOT}`);
      throw new HttpException(httpErrorMessages.TELEGRAM_BOT_TESTER.UNNABLE_CREATE_TELEGRAM_BOT, HttpStatus.CONFLICT);
    }

    let errorCode: number = undefined;
    let errorMessage: string = undefined;

    const messageSended: boolean = await telegramBot.bot.sendMessage(sendMessageDto.chat_id, sendMessageDto.text)
      .then((result: any) => {
        if (result && result.chat && result.chat.id.toString() == sendMessageDto.chat_id) {
          return true;
        }

        return false;
      })
      .catch((error: any) => {
        errorCode = this.telegramBotService.getErrorCode(error.message);
        errorMessage = this.telegramBotService.formatError(errorCode);

        console.log(`[sendMessageGroup] End error: ${JSON.stringify(error)}`);
        throw new HttpException(errorMessage, errorCode);
      });

    await this.telegramBotService.stopBot(telegramBot);

    if (sendMessageDto.user) {
      const telegramBotResultDto: TelegramBotResultDto = {
        user: sendMessageDto.user,
        token: sendMessageDto.token,
        chat_id: sendMessageDto.chat_id,
        text: sendMessageDto.text,
        success: messageSended,
        errorCode: errorCode != undefined ? errorCode : undefined,
        errorMessage: errorMessage != undefined ? errorMessage : undefined,
      }

      const createdBotResult: ITelegramBotResult = await this.telegramBotResultsService.addTelegramBotResult(telegramBotResultDto);
      if (!createdBotResult) {
        console.log(`[sendMessageGroup] ${httpErrorMessages.TELEGRAM_BOT_RESULTS.UNNABLE_CREATE_TELEGRAM_BOT_RESULT}`);
        throw new HttpException(httpErrorMessages.TELEGRAM_BOT_RESULTS.UNNABLE_CREATE_TELEGRAM_BOT_RESULT, HttpStatus.CONFLICT);
      }

      await this.websocketsService.notifyWebsockets(websocketEvents.WS_TELEGRAM_BOT_RESULT);
    }

    console.log(`[sendMessageGroup] End: chat id '${sendMessageDto.chat_id}', token '${sendMessageDto.token}' result: ${messageSended}`);
    return res.status(200).json(messageSended);
  }
}
  