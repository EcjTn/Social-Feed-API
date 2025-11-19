import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikes } from './entities/post-likes.entity';
import { CommentLikes } from './entities/comment-likes.entity';
import { PostLikesController } from './post-likes.controller';
import { CommentLikesController } from './comment-likes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostLikes, CommentLikes]),
],
  controllers: [PostLikesController, CommentLikesController],
  providers: [LikesService],
})
export class LikesModule {}
