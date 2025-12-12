import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './configs/swagger.config';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  app.use(compression())
  app.use(cookieParser())
  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }))

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('swagger', app, documentFactory);

  app.setGlobalPrefix('/api/v1')

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
