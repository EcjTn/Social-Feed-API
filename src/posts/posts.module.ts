import { Module, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController, UsersPostController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entity/user.entity';
import { Posts } from './entity/post.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Posts]),
  ],
  controllers: [PostsController, UsersPostController],
  providers: [PostsService],
})
export class PostsModule {}
