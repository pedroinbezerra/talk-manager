import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RchatController } from './rchat.controller';
import { RchatService } from './rchat.service';
import { BotpressService } from '../botpress/botpress.service';

@Module({
  imports: [ConfigModule],
  controllers: [RchatController],
  providers: [RchatService, BotpressService, BotpressService],
  exports: [RchatService]
})
export class RchatModule {}
