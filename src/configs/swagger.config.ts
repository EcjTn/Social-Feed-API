import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Social Feed API')
    .setDescription('The API documentation for the Social Feed')
    .build();