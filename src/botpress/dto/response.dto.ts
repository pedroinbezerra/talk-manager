import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ResponseDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsOptional()
    @IsObject()
    workflow: object;

    @IsNotEmpty()
    @IsString()
    text: string;

    @IsArray()
    @IsOptional()
    variations: string[];

    @IsNotEmpty()
    @IsBoolean()
    typing: boolean;
}

export class BotResponseDto {
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => ResponseDto)
    responses: ResponseDto[];
}