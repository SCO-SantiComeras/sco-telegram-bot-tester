import { validationErrorMessages } from '../../../constants/validation-error-messages.constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: validationErrorMessages.USERS.ID.INVALID_VALUE })
  _id?: string;

  @ApiProperty()
  @IsNotEmpty({ message: validationErrorMessages.USERS.NAME.NOT_EMPTY })
  @IsString({ message: validationErrorMessages.USERS.NAME.INVALID_VALUE })
  @MinLength(4, { message: validationErrorMessages.USERS.NAME.MIN_LENGTH })
  @MaxLength(15, { message: validationErrorMessages.USERS.NAME.MAX_LENGTH })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: validationErrorMessages.USERS.PASSWORD.INVALID_VALUE })
  @MinLength(8, { message: validationErrorMessages.USERS.PASSWORD.MIN_LENGTH })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: validationErrorMessages.USERS.PASSWORD.MATCHES }
  )
  password?: string;

  @ApiProperty()
  @IsNotEmpty({ message: validationErrorMessages.USERS.EMAIL.NOT_EMPTY })
  @IsString({ message: validationErrorMessages.USERS.EMAIL.INVALID_VALUE })
  @Matches(
    /.+@.+\..+/,
    { message: validationErrorMessages.USERS.EMAIL.MATCHES }
  )
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: validationErrorMessages.USERS.ACTIVE.INVALID_VALUE})
  active?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: validationErrorMessages.USERS.ROLE.INVALID_VALUE})
  role?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: validationErrorMessages.USERS.PWD_RECOVERY_TOKEN.INVALID_VALUE })
  pwdRecoveryToken?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: validationErrorMessages.USERS.PWD_RECOVERY_DATE.INVALID_VALUE })
  pwdRecoveryDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: validationErrorMessages.USERS.TYPE_OBJ.INVALID_VALUE })
  typeObj?: string;
}
