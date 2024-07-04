import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class RchatPayloadDto {
    @IsNotEmpty()
    @IsString()
    roomId: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    guestToken: string;

    @IsNotEmpty()
    @IsString()
    department: string;

    @IsNotEmpty()
    @IsString()
    messageId: string;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsOptional()
    @IsDateString()
    closedAt: string;
}