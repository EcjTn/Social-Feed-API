import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { UsersModule } from 'src/users/users.module';
import { CommentsModule } from 'src/comments/comments.module';
import { PostsModule } from 'src/posts/posts.module';
import { Like } from 'typeorm';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  imports: [
    UsersModule,
    CommentsModule,
    PostsModule
  ],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
