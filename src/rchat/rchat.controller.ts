import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RchatService } from './rchat.service';
import { RchatResponseDto } from './dto/rchatResponse.dto';
import { RchatPayloadDto } from './dto/rchatPayload.dto';

var debug: boolean;
@Controller('rchat')
export class RchatController {

    constructor(
        private configService: ConfigService,
        private rchatService: RchatService
    ) {
        debug = configService.get('DEBUG');
    }

    @Post('/listen')
    @HttpCode(200)
    async listen(@Body() data: RchatResponseDto) {
        const rchatMessage: RchatPayloadDto = {
            type: data.type,
            roomId: data._id,
            guestToken: data.visitor.token,
            department: data.visitor.department,
            messageId: data.messages[0]._id,
            message: data.messages[0].msg,
            closedAt: data.closedAt
        }

        console.log('Mensagem recebida do Rocket.Chat 🐈‍');

        // if (debug) {
        //     console.log(data);
        // }

        await this.rchatService.sendResponse(rchatMessage);
    }
}
