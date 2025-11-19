import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/posts/:id')
  public async likePost(@User() user: IJwtPayload, @Param('id', ParseIntPipe)post_id: number) {
    return await this.likesService.addPostLike(user.sub, post_id)
  }


  @Delete('/posts/:id')
  public async unlikePost(@User() user: IJwtPayload, @Param('id', ParseIntPipe)post_id: number) {
    return await this.likesService.removePostLike(user.sub, post_id)
  }

  @Post('/comments/:commentId')
  public async addCommentLike(@User()user: IJwtPayload, @Param('commentId', ParseIntPipe)commentId: number) {
    return await this.likesService.addCommentLike(user.sub, commentId)
  }

  @Delete('/comments/:commentId')
  public async removeCommentLike(@User()user: IJwtPayload, @Param('comment:Id', ParseIntPipe)commentId: number) {
    return await this.likesService.removeCommentLike(user.sub, commentId)
  }

}