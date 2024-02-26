import { httpErrorMessages } from './../../constants/http-error-messages.constants';
import { Body, Controller, HttpException, HttpStatus, Post, Res, ValidationPipe } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Response } from 'express';
import { TelegramBot } from './class/telegram-bot';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { websocketEvents } from '../websocket/constants/websocket.events';

@Controller('api/v1/telegram-bot')
export class TelegramBotController {

  constructor(
    private readonly telegramBotService: TelegramBotService,
    private readonly websocketsService: WebsocketGateway,
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
          chat_id: '-4102531622',
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

    const telegramBot: TelegramBot = await this.telegramBotService.initializeBot(sendMessageDto.token);
    if (!telegramBot) {
      console.log(`[sendMessageGroup] ${httpErrorMessages.TELEGRAM_BOT_TESTER.UNNABLE_CREATE_TELEGRAM_BOT}`);
      throw new HttpException(httpErrorMessages.TELEGRAM_BOT_TESTER.UNNABLE_CREATE_TELEGRAM_BOT, HttpStatus.CONFLICT);
    }

    const messageSended: boolean = await telegramBot.bot.sendMessage(sendMessageDto.chat_id, sendMessageDto.text)
      .then((result: any) => {
        if (result && result.chat && result.chat.id.toString() == sendMessageDto.chat_id) {
          return true;
        }

        return false;
      })
      .catch((error: any) => {
        const code: number = this.telegramBotService.getErrorCode(error.message);
        const message: string = this.telegramBotService.formatError(code);

        console.log(`[sendMessageGroup] End error: ${JSON.stringify(error)}`);
        throw new HttpException(message, code);
      });

    await this.telegramBotService.stopBot(telegramBot);

    if (messageSended) {
      await this.websocketsService.notifyWebsockets(websocketEvents.WS_SEND_MESSAGE_GROUP);
    } 

    console.log(`[sendMessageGroup] End: chat id '${sendMessageDto.chat_id}', token '${sendMessageDto.token}' result: ${messageSended}`);
    return res.status(200).json(messageSended);
  }
}
  