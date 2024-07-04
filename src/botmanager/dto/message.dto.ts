import { IsNotEmpty, IsString } from "class-validator";

export class MessageDto {
    @IsNotEmpty()
    @IsString()
    sessionId: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}