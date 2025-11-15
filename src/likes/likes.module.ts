import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikes } from './entities/post-likes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostLikes]),
],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
