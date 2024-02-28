import { validationErrorMessages } from '../../../constants/validation-error-messages.constants';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { UserDto } from 'src/modules/users/dto/user.dto';

export class SendMessageDto {
    
    @ApiProperty()
    @IsString({ message: validationErrorMessages.SEND_MESSAGE.TOKEN.INVALID_VALUE })
    @IsNotEmpty({ message: validationErrorMessages.SEND_MESSAGE.TOKEN.NOT_EMPTY })
    token: string;

    @ApiProperty()
    @IsString({ message: validationErrorMessages.SEND_MESSAGE.CHAT_ID.INVALID_VALUE })
    @IsNotEmpty({ message: validationErrorMessages.SEND_MESSAGE.CHAT_ID.NOT_EMPTY })
    chat_id: string;

    @ApiProperty()
    @IsString({ message: validationErrorMessages.SEND_MESSAGE.TEXT.INVALID_VALUE })
    @IsNotEmpty({ message: validationErrorMessages.SEND_MESSAGE.TEXT.NOT_EMPTY })
    text: string;

    @ApiProperty()
    @IsObject({ message: validationErrorMessages.SEND_MESSAGE.TOKEN.INVALID_VALUE })
    @IsOptional()
    user?: UserDto;
}