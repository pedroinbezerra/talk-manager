import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class SendArrayMessageDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    roomId: string;

    @ArrayNotEmpty()
    @IsArray()
    @Type(() => String)
    messages: string[];

    @IsNumber()
    @IsOptional()
    index: number;
}