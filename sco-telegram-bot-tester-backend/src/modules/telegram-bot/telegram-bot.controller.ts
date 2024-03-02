import { httpErrorMessages } from './../../constants/http-error-messages.constants';
import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Response } from 'express';
import { TelegramBot } from './class/telegram-bot';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { websocketEvents } from '../websocket/constants/websocket.events';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/interface/iuser.interface';
import { TelegramBotResultDto } from '../telegram-bot-results/dto/telegram-bot-result.dto';
import { TelegramBotResultsService } from '../telegram-bot-results/telegram-bot-results.service';
import { ITelegramBotResult } from '../telegram-bot-results/interface/itelegram-bot-result.interface';

@Controller('api/v1/telegram-bot')
@ApiTags('Telegram bot tester')
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
    description: 'Envíar un mensaje a un grupo de telegram',
  })
  @ApiBody({
    description: 'Ejemplo de envío de mensaje a un grupo de telegram utilizando la clase SendMessageDto',
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
    description: 'Mensaje envíado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'Token del bot está no autorizado',
  })
  @ApiResponse({
    status: 400,
    description: 'Chat de telegram no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'El mensaje de texto esta vacío',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Token del bot no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible crear instancia del bot de telegram',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible crear un resultado del bot de telegram',
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
      throw new HttpException(httpErrorMessages.TELEGRAM_BOT_TESTER.UNNABLE_CREATE_TELEGRAM_BOT, HttpStatus.INTERNAL_SERVER_ERROR);
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
        return false;
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
        throw new HttpException(httpErrorMessages.TELEGRAM_BOT_RESULTS.UNNABLE_CREATE_TELEGRAM_BOT_RESULT, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      await this.websocketsService.notifyWebsockets(websocketEvents.WS_TELEGRAM_BOT_RESULT);
    }

    if (errorCode != undefined && errorMessage) {
      console.log(`[sendMessageGroup] End error: ${errorCode} - ${errorMessage}`);
      throw new HttpException(errorMessage, errorCode);
    }

    console.log(`[sendMessageGroup] End: chat id '${sendMessageDto.chat_id}', token '${sendMessageDto.token}' result: ${messageSended}`);
    return res.status(200).json(messageSended);
  }
}
  