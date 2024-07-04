import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RchatResponseDto } from './dto/rchatResponse.dto';
import { WhatsappSendMessageDto } from './dto/whatsappResponse.dto';
import { RchatPayloadDto } from './dto/rchatPayload.dto';
import { BotpressService } from 'src/botpress/botpress.service';
import { BotResponseDto, ResponseDto } from 'src/botpress/dto/response.dto';

var rchatBaseUrl: string;
var whatsappBaseUrl: string;

@Injectable()
export class RchatService {
  constructor(
    private configService: ConfigService,
    private botpressService: BotpressService,
    @Inject(CACHE_MANAGER) private cacheManager: any
  ) {
    rchatBaseUrl = configService.get('ROCKETCHAT_BASE_URL');
    whatsappBaseUrl = configService.get('WHATSAPP_BASE_URL');
  }

  async login() {
    const rchatUser = process.env.ROCKETCHAT_USER;
    const rchatPass = process.env.ROCKETCHAT_PASS;

    const res = await axios.post(`${rchatBaseUrl}/api/v1/login`, {
      user: rchatUser,
      password: rchatPass
    });

    if (res.data.status === "success") {
      return res.data.data;
    } else {
      console.log("##########\nError on Rocket.Chat login");
      console.log(res);
      console.log("##########\n");
    }
  }

  async registerGuest(data: any) {
    console.log('[registerGuest] - Registrando guest 🚀');
    const endpoint = `${rchatBaseUrl}/api/v1/livechat/visitor`;

    const payload = {
      visitor: {
        name: data.name || data.sessionId,
        email: data.email || '',
        token: data.sessionId,
        phone: data.phone || data.sessionId
      }
    }

    return await axios.post(endpoint, payload);
  }

  async createRoom(guestToken: string) {
    console.log('[createRoom] - Criando sala 🚀');
    return await axios.get(`${rchatBaseUrl}/api/v1/livechat/room?token=${guestToken}`).catch(err => err.response.data)
  }

  async sendMessage(token: string, roomId: string, message: string) {
    console.log('[sendMessage] - Enviando mensagem para Rocket.Chat 🚀');
    const endpoint = `${rchatBaseUrl}/api/v1/livechat/message`;

    const payload = {
      token,
      rid: roomId,
      msg: message
    }

    return await axios.post(endpoint, payload);
  }

  async roomTransfer(roomId: string, departmentId: string) {
    console.log('[roomTransfer] - Transferindo sala 🚀');
    const { authToken, userId } = await this.login();

    const endpoint = `${rchatBaseUrl}/api/v1/livechat/room.forward`;
    const payload = {
      roomId,
      departmentId
    };
    const httpOpts = {
      headers: {
        'X-Auth-Token': authToken,
        'X-User-Id': userId
      }
    };

    return await axios.post(endpoint, payload, httpOpts);
  }

  async roomInfo(token: string, roomId: string) {
    console.log('[roomInfo] - Obtendo informações da sala 🚀');
    const endpoint = `${rchatBaseUrl}/api/v1/livechat/room?token=${token}&rid=${roomId}`;
    return await axios.get(endpoint);
  }

  async sendResponse(data: RchatPayloadDto) {
    var payload: WhatsappSendMessageDto = {
      messages: [data.message],
      to: data.guestToken
    }

    if(data.type === 'LivechatSession' && !!data.closedAt) {
      const botResponse: BotResponseDto = await this.botpressService.sendMessage("sair");
      await this.cacheManager.del(`guest_${data.guestToken}`);

      payload.messages = [];

      botResponse.responses.map((res: ResponseDto) => {
        payload.messages.push(res.text);
      })
    }

    console.log('[sendResponse] - Enviando resposta recebida do Rocket.Chat 🚀');
    await axios.post(`${whatsappBaseUrl}/message/send`, payload).then(res => {
      console.log('[sendResponse] - Resposta enviada com sucesso');
    }).catch(err => {
      console.log('[sendResponse] - Erro ao enviar resposta:');
      console.log(err);
    })
  }
}
