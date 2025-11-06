import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'
import { GlobalFilter } from './common/global.filter';
import cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors())
  app.use(cookieParser())
  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  app.useGlobalFilters(new GlobalFilter())

  app.setGlobalPrefix('/api/v1')

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
