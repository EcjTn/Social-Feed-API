import { Module, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entity/post.entity';
import { UsersModule } from 'src/users/users.module';
import { UserPostsController } from './user-posts.controller';
import { PostsController } from './posts.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Posts]),
  ],
  controllers: [PostsController, UserPostsController],
  providers: [PostsService],
})
export class PostsModule {}
