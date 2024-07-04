import { IsNotEmpty, IsString } from "class-validator";

export class RoomTransferDto {
    @IsNotEmpty()
    @IsString()
    roomId: string;

    @IsNotEmpty()
    @IsString()
    departmentId: string;

    @IsNotEmpty()
    @IsString()
    visitorToken: string;
}