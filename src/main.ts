import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.RCHAT_WEBHOOK_PORT);

  console.log('\n############################################');
  console.log('\n  Aplicação iniciada ⚙️');
  console.log(`     Porta: ${process.env.RCHAT_WEBHOOK_PORT} 💻`);
  console.log('     Debug: ', process.env.DEBUG ? 'ativo ✅' : 'inativo 🚫');
  console.log('\n############################################');
  
}
bootstrap();
