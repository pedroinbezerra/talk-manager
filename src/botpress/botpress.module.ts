import { Module } from '@nestjs/common';
import { BotpressService } from './botpress.service';
import { BotpressController } from './botpress.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BotpressService],
  controllers: [BotpressController],
  exports: [BotpressService]
})
export class BotpressModule {}
