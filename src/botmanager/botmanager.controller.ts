import { Body, Controller, HttpCode, Post, Param } from '@nestjs/common';
import { BotmanagerService } from './botmanager.service';

@Controller('botmanager')
export class BotmanagerController {
  constructor(private botManagerController: BotmanagerService) {}

  @Post()
  @HttpCode(200)
  async sendMessage(@Body() data: object) {
    return this.botManagerController.message(data);
  }

  @Post('/close')
  @HttpCode(200)
  async closeChat(@Body() data) {
    return this.botManagerController.closeChat(data.token);
  }
}
