import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { RchatService } from '../rchat/rchat.service';
import { BotpressService } from '../botpress/botpress.service';
import { ConfigService } from '@nestjs/config';
import { MessageDto } from './dto/message.dto';
import { RoomTransferDto } from './dto/roomTransfer.dto';
import { SendArrayMessageDto } from './dto/sendMessage.dto';

const defaultDepartment = '653a66c65db2abbe9516b41b';
var debug: boolean;
@Injectable()
export class BotmanagerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: any,
    @Inject(RchatService) private rchatService: RchatService,
    @Inject(BotpressService) private botpressService: BotpressService,
    private configService: ConfigService,
  ) {
    debug = configService.get('DEBUG');
  }

  // TODO: Criar um módulo Util e mover pra lá
  async getResponses(data) {
    console.log('[getResponses] - Ajustando respostas do Botpress 🤖');
    var responses = [];

    await data.responses.map(async (response) => {
      responses.push({ content: response.text, type: 'text' });
    });

    return responses;
  }

  // TODO: Criar um módulo Util e mover pra lá
  async updateContext(token: string, newContext) {
    console.log('[updateContext] - Atualizando contexto 💾');
    return await this.cacheManager
      .get(`guest_${token}`)
      .then((res) => {
        res = JSON.parse(res);

        delete newContext?.__stacktrace;

        if (debug) {
          console.log('Contexto atual:');
          console.log(res);

          console.log('Contexo recebido:');
          console.log(newContext);

          console.log('Contexto atualizado:');
          console.log(context);
        }

        var context = { ...res, ...newContext, token };

        if (context) {
          this.cacheManager.set(`guest_${token}`, JSON.stringify(context));
        }

        return context;
      })
      .catch((err) => {
        console.log('[updateContext] - Erro:');
        console.log(err);
      });
  }

  // TODO: Criar um módulo Util e mover pra lá
  async replaceContext(token: string, newContext) {
    console.log('[updateContext] - Atualizando contexto 💾');
    return await this.cacheManager
      .get(`guest_${token}`)
      .then((res) => {
        res = JSON.parse(res);

        delete newContext?.__stacktrace;

        if (debug) {
          console.log('Contexto atual:');
          console.log(res);

          console.log('Contexo recebido:');
          console.log(newContext);

          console.log('Contexto atualizado:');
          console.log(context);
        }

        var context = { ...newContext, token };

        if (context) {
          this.cacheManager.set(`guest_${token}`, JSON.stringify(context));
        }

        return context;
      })
      .catch((err) => {
        console.log('[updateContext] - Erro:');
        console.log(err);
      });
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
    console.log(
      '[createOrGetGuest] - Obtendo/Ajustando informações do guest ⚙️',
    );
    var context = await this.getContext(data.sessionId);

    if (debug) {
      console.log('[createOrGetGuest] - contexto:');
      console.log(context);
    }

    if (!context.visitorId) {
      return await this.rchatService
        .registerGuest(data)
        .then(async (res) => {
          await this.updateContext(data.sessionId, {
            visitorId: res.data.visitor._id,
          });
          return { ...res.data, firstMessage: true };
        })
        .catch((err) => {
          console.log('[createOrGetGuest] - Error:');
          console.log(err);
        });
    }

    return context;
  }

  async createRoom(visitorToken: string) {
    console.log('[createRoom] - Criando nova sala 🗣️');
    const newRoom = await this.rchatService.createRoom(visitorToken);

    if (debug) {
      console.log('Rchat room create status:');
      console.log(newRoom);
    }

    if (newRoom.errorType) {
      return newRoom;
    }
    await this.updateContext(visitorToken, { roomId: newRoom.data.room._id });

    return newRoom.data.room;
  }

  async roomTransfer(data: RoomTransferDto) {
    const { roomId, departmentId, visitorToken } = data;

    console.log('[roomTransfer] - Transferindo sala ⬅️➡️');
    return await this.rchatService
      .roomTransfer(roomId, departmentId)
      .then(async (res) => {
        await this.updateContext(visitorToken, {
          departmentId: departmentId,
          transfered: true,
        });
        return res.status;
      })
      .catch(async (err) => {
        const data = err.response.data;
        if (data.error === 'error-forwarding-chat-same-department') {
          await this.updateContext(visitorToken, {
            departmentId: departmentId,
            transfered: true,
          });
          console.log('[roomTransfer] - já transferido');
          return;
        }

        console.log('[roomTransfer] - Error:');
        console.log(err.response.data);
      });
  }

  async closeChat(token: string) {
    console.log(
      '[closeChat] - Encerrando sessão no Botpress e limpando cache 🗑️',
    );
    return await this.botpressService.sendMessage('sair').then(async (res) => {
      await this.clearContext(token);
      return res;
    });
  }

  async sendToBot(data) {
    console.log('[sendToBot] - Encaminhando mensagem para Botpress 🤖');
    return await this.botpressService
      .sendMessage(data.message)
      .then(async (res) => {
        await this.updateContext(data.sessionId, res.state);
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendArrayMessage(data: SendArrayMessageDto) {
    if (data.messages.length === data.index) {
      return;
    }

    console.log(data);

    await this.rchatService
      .sendMessage(data.token, data.roomId, `- ${data.messages[data.index]}`)
      .then(() => {
        setTimeout(() => {
          data.index = data.index = data.index + 1;
          this.sendArrayMessage(data);
        }, 1000);
      });
  }

  async message(data: MessageDto) {
    var guestData, botResponse;
    var context = await this.getContext(data.sessionId);

    if (true) {
      console.log('[message] - contexto:');
      console.log(context);
    }

    var transferToHuman = context?.session.transferToHuman;
    var transfered = context?.transfered;

    // Send message to Botpress
    if (!transferToHuman) {
      var botResponse = await this.sendToBot(data);

      context = await this.updateContext(data.sessionId, botResponse.state);

      var clientMessages = [];

      // Atualizando contexto da mensagens enviadas pelo cliente
      if (context.clientMessages) {
        clientMessages = context.clientMessages;
      }
      clientMessages.push(data.message);
      await this.updateContext(data.sessionId, { clientMessages });
      context.clientMessages = clientMessages;

      botResponse = await this.getResponses(botResponse);

      if (!context?.session.transferToHuman) {
        return botResponse;
      } else {
        transferToHuman = true;
      }
    }

    // Send message to Rocket.Chat
    guestData = await this.createOrGetGuest(data);

    if (transferToHuman && !transfered) {
      guestData.token = guestData.token || guestData?.visitor.token;
      const room = await this.createRoom(guestData.token);

      if (room?.errorType === 'no-agent-online') {
        return [
          {
            content:
              'Nenhum agente disponível no momento. Tente novamente mais tarde.',
            type: 'text',
          },
        ];
      }

      const payload = {
        roomId: room._id,
        departmentId: defaultDepartment,
        visitorToken: guestData.token,
      };

      guestData.roomId = room._id;

      await this.roomTransfer(payload);
    }

    if (guestData?.firstMessage) {
      console.log('###############    PRIMEIRA MENSAGEM    #################');
      console.log(context);
      this.rchatService.sendMessage(
        guestData.token,
        guestData.roomId,
        `MENSAGENS DO CLIENTE:\n`,
      );

      await this.sendArrayMessage({
        token: guestData.token,
        roomId: guestData.roomId,
        messages: context.clientMessages,
        index: 0,
      });
      delete context.clientMessages;

      await this.replaceContext(data.sessionId, context);
    } else if (transferToHuman) {
      await this.rchatService.sendMessage(
        guestData.token,
        guestData.roomId,
        data.message,
      );
    }

    if (botResponse) {
      return botResponse;
    }
  }
}
