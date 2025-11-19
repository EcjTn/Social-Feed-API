import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('/posts/:id/like')
@UseGuards(JwtAuthGuard)
export class PostLikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  public async likePost(@User() user: IJwtPayload, @Param('id', ParseIntPipe)post_id: number) {
    return await this.likesService.addPostLike(user.sub, post_id)
  }

  @Delete()
  public async unlikePost(@User() user: IJwtPayload, @Param('id', ParseIntPipe)post_id: number) {
    return await this.likesService.removePostLike(user.sub, post_id)
  }

}