import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { RchatModule } from './rchat/rchat.module';
import { ConfigModule } from '@nestjs/config';
import { BotmanagerController } from './botmanager/botmanager.controller';
import { BotmanagerService } from './botmanager/botmanager.service';
import { BotmanagerModule } from './botmanager/botmanager.module';
import { BotpressModule } from './botpress/botpress.module';
import { RchatService } from './rchat/rchat.service';
import { BotpressService } from './botpress/botpress.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: Number(process.env.TTL)
    }),
    BotmanagerModule,
    BotpressModule,
  ],
  controllers: [BotmanagerController],
  providers: [BotmanagerService, RchatService],
})
export class AppModule { }
