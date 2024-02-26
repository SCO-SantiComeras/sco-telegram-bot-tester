import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { validationErrorMessages } from '../../../constants/validation-error-messages.constants';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: validationErrorMessages.LOGIN.NAME.NOT_EMPTY })
  @IsString({ message: validationErrorMessages.LOGIN.NAME.INVALID_VALUE })
  @MinLength(4, { message: validationErrorMessages.LOGIN.NAME.MIN_LENGTH })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: validationErrorMessages.LOGIN.PASSWORD.NOT_EMPTY })
  @IsString({ message: validationErrorMessages.LOGIN.PASSWORD.INVALID_VALUE })
  @MinLength(8, { message: validationErrorMessages.LOGIN.PASSWORD.MIN_LENGTH })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: validationErrorMessages.LOGIN.PASSWORD.MATCHES }
  )
  password: string;
}
