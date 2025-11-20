import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Social Feed API')
    .setDescription('The Social Feed API lets clients manage posts, profiles, and interactions like likes, comments, and more.')
    .build();