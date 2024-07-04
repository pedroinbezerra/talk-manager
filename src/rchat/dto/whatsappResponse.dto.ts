import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from "class-validator";


export class WhatsappSendMessageDto {
    @ArrayNotEmpty()
    @IsArray()
    @Type(() => String)
    messages: string[];

    @IsNotEmpty()
    @IsString()
    to: string;
}