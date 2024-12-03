import { NestFactory } from '@nestjs/core';
import { ClienteModule } from './frameworks-drivers/api/cliente.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(ClienteModule);
  
  const config = new DocumentBuilder()
  .setTitle('Dog Restaurant API')
  .setDescription('API que gerencia os pedidos da lanchonete')
  .setVersion('1.0')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

}
bootstrap();
