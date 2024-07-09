import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

var baseUrl: string, username: string, password: string;

@Injectable()
export class BotpressService {
  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager,
  ) {
    baseUrl = configService.get('BOTPRESS_BASE_URL');
    username = configService.get('BOTPRESS_USERNAME');
    password = configService.get('BOTPRESS_PASSWORD');
  }

  async auth() {
    return await axios.post(`${baseUrl}/api/v1/auth/login/basic/default`, {
      email: username,
      password: password,
    });
  }

  async sendMessage(message: String) {
    const auth = await this.auth();
    var responses;
    const config = {
      headers: { Authorization: `Bearer ${auth.data.payload.jwt}` },
    };

    await axios
      .post(
        `${baseUrl}/api/v1/bots/gloria/converse/pedro/secured?include=nlu,state,suggestions,decision`,
        {
          type: 'text',
          text: message,
        },
        config,
      )
      .then((res) => {
        responses = res.data;
      })
      .catch((err) => {
        console.log('Erro ao enviar mensagem:');
        console.log(err);
      });

    return responses;
  }
}
