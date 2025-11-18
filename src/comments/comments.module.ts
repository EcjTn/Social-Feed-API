import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entity/comments.entity';
import { UsersModule } from 'src/users/users.module';
import { PostCommentsController } from './post-comments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments]),
    UsersModule
  ],
  controllers: [CommentsController, PostCommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
