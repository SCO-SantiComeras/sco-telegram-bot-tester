import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    chat_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    text: string;
}