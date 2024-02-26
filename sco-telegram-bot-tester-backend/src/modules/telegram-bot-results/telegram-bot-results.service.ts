import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { ITelegramBotResult } from "./interface/itelegram-bot-result.interface";
import { UsersService } from "../users/users.service";
import { TelegramBotResultDto } from "./dto/telegram-bot-result.dto";
import { IUser } from "../users/interface/iuser.interface";
import { UserDto } from "../users/dto/user.dto";

@Injectable()
export class TelegramBotResultsService {

  constructor(
    @Inject('MODEL') private readonly TelegramBotResultModel: Model<ITelegramBotResult>,
    private readonly usersService: UsersService,
  ) {}

  async fetchTelegramBotResults(where?: any): Promise<ITelegramBotResult[]> {
    try {
      return await this.TelegramBotResultModel.find(where).populate('user');
    } catch (error) {
      console.log(`[fetchPermissions] Error: ${JSON.stringify(error)}`);
      return [];
    }
  }

  async addTelegramBotResult(telegramBotResult: TelegramBotResultDto): Promise<ITelegramBotResult> {
    try {
      const newTelegramBotResult = new this.TelegramBotResultModel({
        user: telegramBotResult.user,
        token: telegramBotResult.token,
        chat_id: telegramBotResult.chat_id,
        text: telegramBotResult.text,
        success: telegramBotResult.success,
        errorCode: telegramBotResult.errorCode,
        errorMessage: telegramBotResult.errorMessage,
      });

      const savedTelegramBotResult: ITelegramBotResult = await newTelegramBotResult.save();
      if (!savedTelegramBotResult) {
        console.log(`[addTelegramBotResult] Telegram bot result: ${savedTelegramBotResult._id} unnable to create`);
        return undefined;
      }
      console.log(`[addTelegramBotResult] Telegram bot result: ${savedTelegramBotResult._id} created successfully`);

      return savedTelegramBotResult;
    } catch (error) {
      console.log(`[addTelegramBotResult] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async deleteTelegramBotResult(_id: string): Promise<boolean> {
    try {
      const result = await this.TelegramBotResultModel.deleteOne({ _id });

      if (!result || (result && result.deletedCount != 1)) {
        console.log(`[deleteTelegramBotResult] Telegram Bot Result: ${_id} unnable to delete`);
        return false;
      }
      console.log(`[deleteTelegramBotResult] Telegram Bot Result: ${_id} deleted successfully`);

      return true;
    } catch (error) {
      console.log(`[deleteTelegramBotResult] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async findTelegramBotResult(_id: string): Promise<ITelegramBotResult> {
    try {
      return await this.TelegramBotResultModel.findOne({ _id: _id }).populate('user');
    } catch (error) {
      console.log(`[findTelegramBotResult] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async findTelegramBotResultsByUser(user: string): Promise<ITelegramBotResult[]> {
    const existUser: IUser = await this.usersService.findUserByName(user);
    if (!existUser) {
      return [];
    }

    try {
      const filter: any = { user: existUser };
      return await this.TelegramBotResultModel.find(filter).populate('user');
    } catch (error) {
      console.log(`[findTelegramBotResultsByUser] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }
  
  async modelToDto(telegramBotResult: ITelegramBotResult): Promise<TelegramBotResultDto> {
    const user: IUser = await this.usersService.findUserByName(telegramBotResult.user["name"]);
    const userDto: UserDto = await this.usersService.modelToDto(user);

    const telegramBotResultDto: TelegramBotResultDto = {
      _id: telegramBotResult._id ? telegramBotResult._id : undefined, 
      user: userDto,
      token: telegramBotResult.token,
      chat_id: telegramBotResult.chat_id,
      text: telegramBotResult.text,
      success: telegramBotResult.success,
      errorCode: telegramBotResult.errorCode,
      errorMessage: telegramBotResult.errorMessage,
      createdAt: telegramBotResult.createdAt,
      updatedAt: telegramBotResult.updatedAt,
      typeObj: telegramBotResult.typeObj ? telegramBotResult.typeObj : 'TelegramBotResult', 
    }

    return telegramBotResultDto;
  }

}
