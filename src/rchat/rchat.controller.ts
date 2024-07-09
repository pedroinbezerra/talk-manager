import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RchatService } from './rchat.service';

var debug: boolean;
@Controller('rchat')
export class RchatController {
  constructor(
    private configService: ConfigService,
    private rchatService: RchatService,
  ) {
    debug = configService.get('DEBUG');
  }

  @Post('/Test')
  @HttpCode(200)
  async test(@Body() data) {
    console.log('Teste de recebimento de mensagem do Rocket.Chat 🐈‍⬛');
  }

  @Post('/listen')
  @HttpCode(200)
  async listen(@Body() data) {
    const rchatMessage = {
      roomId: data._id,
      guestToken: data.visitor.token,
      department: data.visitor.department,
      messageId: data.messages[0]._id,
      message: data.messages[0].msg,
    };

    console.log('Mensagem recebida do Rocket.Chat 🐈‍⬛');
    if (debug) {
      console.log(rchatMessage);
    }

    //await this.rchatService.sendResponse(data);
  }
}
