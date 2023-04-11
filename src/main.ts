import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: '*' });
  app.useStaticAssets(join(__dirname, '..', '.well-known'), {
    prefix: '/.well-known/',
  });

  const config = new DocumentBuilder()
    .setTitle('ChatGPT Chess Game')
    .setDescription('Endpoints for a chess game designed for AI')
    .setVersion('1.0')
    .addTag('Chess')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}

bootstrap();
