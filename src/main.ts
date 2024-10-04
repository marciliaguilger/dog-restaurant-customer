import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClienteModule } from './application/cliente.module';

async function bootstrap() {
  const app = await NestFactory.create(ClienteModule);
  await app.listen(3000);
}
bootstrap();
