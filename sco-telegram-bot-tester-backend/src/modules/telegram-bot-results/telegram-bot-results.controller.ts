import { httpErrorMessages } from '../../constants/http-error-messages.constants';
import { IUser } from 'src/modules/users/interface/iuser.interface';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import { ControllerService } from "../shared/services/controller.service";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { AuthGuard } from "@nestjs/passport";
import { ITelegramBotResult } from "./interface/itelegram-bot-result.interface";
import { TelegramBotResultsService } from "./telegram-bot-results.service";
import { Response } from 'express';
import { TelegramBotResultDto } from "./dto/telegram-bot-result.dto";
import { usersConstants } from "../users/constants/user.constants";
import { websocketEvents } from '../websocket/constants/websocket.events';

@Controller('api/v1/telegram-bot-results')
@ApiTags('Resultados bot de telegram')
export class TelegramBotResultsController {
  constructor(
    private readonly botResultsService: TelegramBotResultsService,
    private readonly usersService: UsersService,
    private readonly controllerService: ControllerService,
    private readonly websocketsService: WebsocketGateway,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Fetch telegram bot results, authguard required`,
    description: 'Devuelve los resultados del bot de telegram, se puede filtrar por parámetros QUERY. Necesaria autorización',
  })
  @ApiQuery({
    description: 'Devuelve los usuarios filtrados por una query, si no hay query, devuelve todos',
    type: String,
    required: false,
    name: 'query',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados del bot de telegram devueltos correctamente',
  })
  async fetchTelegramBotResults(@Res() res: Response, @Query() query?: any): Promise<Response<ITelegramBotResult[], Record<string, ITelegramBotResult[]>>> {
    const filter = query && query.query ? await this.controllerService.getParamsFromSwaggerQuery(query.query) : query;
    const telegramBotResults: ITelegramBotResult[] = await this.botResultsService.fetchTelegramBotResults(filter);
    return res.status(200).json(telegramBotResults);
  }

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Add user, authguard required`,
    description: 'Añade un nuevo usuario a la aplicación. Necesaria autorización',
  })
  @ApiBody({
    description: 'Ejemplo de creación de resultado del bot de telegram utilizando la clase TelegramBotResultDto',
    type: TelegramBotResultDto,
    examples: {
      a: {
        value: {
          user: {
            name: usersConstants.PUBLIC.NAME,
            password: usersConstants.PUBLIC.PASSWORD,
            email: usersConstants.PUBLIC.EMAIL,
            active: usersConstants.PUBLIC.ACTIVE,
          },
          token: '5005652633:AAF_Yik_jDa1Vj-to79OGJkJbTXE_FYjsvk',
          chat_id: '-4173364857',
          text: 'Telegram Bot Tester Mock Message',
          success: true,
          errorCode: undefined,
          errorMessage: undefined,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado del bot de telegram añadido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async addTelegramBotResult(@Res() res: Response, @Body() telegramBotResult: TelegramBotResultDto): Promise<Response<ITelegramBotResult, Record<string, ITelegramBotResult>>> {
    const existUser: IUser = await this.usersService.findUserByName(telegramBotResult.user.name);
    if (!existUser) {
      console.error('[addTelegramBotResult] User Not Found');
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    try {
      const createdBotResult: ITelegramBotResult = await this.botResultsService.addTelegramBotResult(telegramBotResult);
      if (createdBotResult) {
        await this.websocketsService.notifyWebsockets(websocketEvents.WS_TELEGRAM_BOT_RESULT);
        return res.status(200).json(createdBotResult);
      }
    } catch (error) {
      throw new HttpException(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      return undefined;
    }
  }

  @Delete('/:_id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Delete telegram bot result, authguard required`,
    description: 'Elimina un resultado del bot de telegram existente de la aplicación. Necesaria autorización',
  })
  @ApiParam({
    description: 'Id del resultado del bot de telegram para eliminar',
    type: String,
    required: false,
    name: '_id',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado del bot de telegram no encontrado',
  })
  async deleteTelegramBotResult(@Res() res: Response, @Param('_id') _id: string): Promise<Response<boolean, Record<string, boolean>>> {
    const existTelegramBotResult: ITelegramBotResult = await this.botResultsService.findTelegramBotResult(_id);
    if (!existTelegramBotResult) {
      console.log(`[deleteTelegramBotResult] Telegram bot result not found`);
      throw new HttpException(httpErrorMessages.TELEGRAM_BOT_RESULTS.TELEGRAM_BOT_RESULT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    try {
      const deletedBotResult: boolean = await this.botResultsService.deleteTelegramBotResult(_id);
      if (deletedBotResult) {
        await this.websocketsService.notifyWebsockets(websocketEvents.WS_TELEGRAM_BOT_RESULT);
      }
      return res.status(200).json(deletedBotResult);
    } catch (error) {
      throw new HttpException(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
