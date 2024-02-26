import { validationErrorMessages } from '../../../constants/validation-error-messages.constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';

export class TelegramBotResultDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.ID.INVALID_VALUE })
  _id?: string;

  @ApiProperty()
  @IsNotEmpty({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.USER.NOT_EMPTY })
  @IsObject({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.USER.INVALID_VALUE })
  user: UserDto;

  @ApiProperty()
  @IsNotEmpty({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.TOKEN.NOT_EMPTY })
  @IsString({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.TOKEN.INVALID_VALUE })
  token: string;

  @ApiProperty()
  @IsNotEmpty({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.CHAT_ID.NOT_EMPTY })
  @IsString({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.CHAT_ID.INVALID_VALUE })
  chat_id: string;

  @ApiProperty()
  @IsNotEmpty({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.TEXT.NOT_EMPTY })
  @IsString({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.TEXT.INVALID_VALUE })
  text: string;

  @ApiProperty()
  @IsNotEmpty({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.SUCCESS.NOT_EMPTY })
  @IsBoolean({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.SUCCESS.INVALID_VALUE })
  success: boolean;

  @ApiProperty()
  @IsOptional()
  errorCode?: number;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.ERROR_MESSAGE.INVALID_VALUE })
  errorMessage?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.CREATED_AT.INVALID_VALUE })
  createdAt?: Date;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.UPDATED_AT.INVALID_VALUE })
  updatedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: validationErrorMessages.TELEGRAM_BOT_RESULT.TYPE_OBJ.INVALID_VALUE })
  typeObj?: string;
}
