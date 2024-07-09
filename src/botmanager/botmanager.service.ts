import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { RchatService } from 'src/rchat/rchat.service';
import { BotpressService } from 'src/botpress/botpress.service';
import { ConfigService } from '@nestjs/config';

const defaultDepartment = "65fc70acfd5f1fbddbbd9fc2";
var debug: boolean;
@Injectable()
export class BotmanagerService {
  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: any,
    @Inject(RchatService) private rchatService: RchatService,
    @Inject(BotpressService) private botpressService: BotpressService
  ) {
    debug = configService.get('DEBUG');
  }

  // TODO: Criar um módulo Util e mover pra lá
  async getResponses(data) {
    console.log('[getResponses] - Ajustando respostas do Botpress 🤖');
    var responses = [];

    await data.responses.map(async response => {
      responses.push({ content: response.text, type: 'text' });
    });

    return responses;
  }

  // TODO: Criar um módulo Util e mover pra lá
  async updateContext(token: string, newContext) {
    console.log('[updateContext] - Atualizando contexto 💾');
    return await this.cacheManager.get(`guest_${token}`).then(res => {
      res = JSON.parse(res);

      delete newContext?.__stacktrace;

      if (debug) {
        console.log("Contexto atual:");
        console.log(res);

        console.log("Contexo recebido:");
        console.log(newContext);

        var context = { ...res, ...newContext, token };

        console.log("Contexto atualizado:");
        console.log(context);
      }

      if(context) {
        this.cacheManager.set(`guest_${token}`, JSON.stringify(context));
      }

      return context;
    }).catch(err => {
      console.log('[updateContext] - Erro:');
      console.log(err);
    })
  }

  // TODO: Criar um módulo Util e mover pra lá
  async clearContext(token: string) {
    console.log('[clearContext] - Limpando contexto 🗑️');
    return await this.cacheManager.del(`guest_${token}`);
  }

  // TODO: Criar um módulo Util e mover pra lá
  async getContext(token) {
    console.log('[getContext] - Obtendo contexto 💾');
    var cache = await this.cacheManager.get(`guest_${token}`);
    return JSON.parse(cache);
  }

  async createOrGetGuest(data: any) {
    console.log('[createOrGetGuest] - Obtendo/Ajustando informações do guest ⚙️');
    var context = await this.getContext(data.sessionId);

    if (debug) {
      console.log('[createOrGetGuest] - contexto:')
      console.log(context)
    }

    if (!context.visitorId) {
      return await this.rchatService.registerGuest(data).then(async res => {
        await this.updateContext(data.sessionId, { visitorId: res.data.visitor._id });
        return res.data;
      }).catch(err => {
        console.log('[createOrGetGuest] - Error:');
        console.log(err);
      });
    }

    return context
  }

  async createRoom(visitorToken: string) {
    console.log('[createRoom] - Criando nova sala 🗣️');
    return await this.rchatService.createRoom(visitorToken).then(async res => {
      var teste = await this.updateContext(visitorToken, { roomId: res.data.room._id });
      return res.data.room;
    }).catch(err => {
      console.log('[createRoom] - Error:');
      console.log(err);
    })
  }

  async roomTransfer(roomId: string, departmentId: string, visitorToken: string) {
    console.log('[roomTransfer] - Transferindo sala ⬅️➡️');
    return await this.rchatService.roomTransfer(roomId, departmentId).then(async res => {
      await this.updateContext(visitorToken, { departmentId: departmentId, transfered: true })
      return res.status;
    }).catch(async err => {
      const data = err.response.data;
      if (data.error === 'error-forwarding-chat-same-department') {
        await this.updateContext(visitorToken, { departmentId: departmentId, transfered: true })
        console.log('[roomTransfer] - já transferido');
        return;
      }

      console.log('[roomTransfer] - Error:');
      console.log(err.response.data);
    })
  }

  async closeChat(token) {
    console.log('[closeChat] - Encerrando sessão no Botpress e limpando cache 🗑️');
    return await this.botpressService.sendMessage("sair").then(async res => {
      await this.clearContext(token);
      return res;
    });
  }

  async sendToBot(data) {
    console.log('[sendToBot] - Encaminhando mensagem para Botpress 🤖');
    return await this.botpressService.sendMessage(data.message).then(async res => {
      await this.updateContext(data.sessionId, res.state);
      return res;
    });
  }

  async message(data: any) {
    var room, guestData, botResponse;
    var context = await this.getContext(data.sessionId);

    if (debug) {
      console.log('[message] - contexto:');
      console.log(context);
    }

    var transferToHuman = context?.session.transferToHuman;
    var transfered = context?.transfered;

    // Send message to Botpress
    if (!transferToHuman) {
      var botResponse = await this.sendToBot(data);

      context = await this.updateContext(data.sessionId, botResponse.state);

      botResponse = await this.getResponses(botResponse);

      if (!context?.session.transferToHuman) {
        return botResponse
      } else {
        transferToHuman = true;
      }
    }

    // Send message to Rocket.Chat
    guestData = await this.createOrGetGuest(data);

    if (debug) {
      console.log('guestData')
      console.log(guestData)
    }

    if (transferToHuman && !transfered) {
      guestData.token = guestData.token || guestData?.visitor.token;
      room = await this.createRoom(guestData.token);
      guestData.roomId = room._id;

      await this.roomTransfer(room._id, defaultDepartment, guestData.token);
    }

    if (transferToHuman) {
      await this.rchatService.sendMessage(guestData.token, guestData.roomId, data.message);
    }

    if (botResponse) {
      return botResponse;
    }
  }
}
