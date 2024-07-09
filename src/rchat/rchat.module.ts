import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RchatController } from './rchat.controller';
import { RchatService } from './rchat.service';

@Module({
  imports: [ConfigModule],
  controllers: [RchatController],
  providers: [RchatService],
  exports: [RchatService]
})
export class RchatModule {}
