import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { typeOrmAsyncOption } from './config/database.config';
import { RecaptchaModule } from './recaptcha/recaptcha.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync(typeOrmAsyncOption),
    UsersModule,
    AuthModule,
    RecaptchaModule,
    PostsModule,
    LikesModule
  ]
})
export class AppModule {}
