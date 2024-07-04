import { ArrayNotEmpty, IsArray, IsDateString, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

class Visitor {
    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsNotEmpty()
    @IsString()
    token: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    department: string;
}

class Agent {
    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string
}

class Message {
    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    msg: string;

    @IsNotEmpty()
    @IsDateString()
    ts: string;

    @IsNotEmpty()
    @IsDateString()
    rid: string;

    @IsNotEmpty()
    @IsString()
    agentId: string;

    @IsNotEmpty()
    @IsDateString()
    _updatedAt: string;
}

export class RchatResponseDto {
    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsNotEmpty()
    @IsString()
    label: string;

    @IsNotEmpty()
    @IsDateString()
    createdAt: string;

    @IsNotEmpty()
    @IsDateString()
    lastMessageAt: string;

    @IsObject()
    @Type(() => Visitor)
    @IsNotEmptyObject()
    visitor: Visitor;

    @IsObject()
    @Type(() => Agent)
    @IsNotEmptyObject()
    agent: Agent;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Message)
    messages: Message[];

    @IsOptional()
    @IsDateString()
    closedAt: string;
}