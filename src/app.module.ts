import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { typeOrmAsyncOption } from './configs/database.config';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { throttlerOptionsSync } from './configs/throttler.config';
import { APP_GUARD } from '@nestjs/core';
import { CommentsModule } from './comments/comments.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    ThrottlerModule.forRoot(throttlerOptionsSync),
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync(typeOrmAsyncOption),
    UsersModule,
    AuthModule,
    PostsModule,
    LikesModule,
    CommentsModule,
    FollowModule
  ],

  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }]

})
export class AppModule {}
