import { Body, Controller, HttpCode, Post, Param, } from '@nestjs/common';
import { BotmanagerService } from './botmanager.service';
import { MessageDto } from './dto/message.dto';

@Controller('botmanager')
export class BotmanagerController {
    constructor(
        private botManagerController: BotmanagerService
    ) { }

    @Post()
    @HttpCode(200)
    async sendMessage(@Body() data: MessageDto) {
        return this.botManagerController.message(data);
    }

    @Post('/close')
    @HttpCode(200)
    async closeChat(@Body() data) {
        return this.botManagerController.closeChat(data.token);
    }
}
