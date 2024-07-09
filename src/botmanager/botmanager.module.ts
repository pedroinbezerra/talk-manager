import { Module } from '@nestjs/common';
import { BotmanagerController } from './botmanager.controller';
import { RchatController } from 'src/rchat/rchat.controller';
import { BotmanagerService } from './botmanager.service';
import { RchatService } from 'src/rchat/rchat.service';
import { BotpressService } from 'src/botpress/botpress.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [RchatController, BotmanagerController],
    providers: [RchatService, BotmanagerService, BotpressService],
})
export class BotmanagerModule { }
