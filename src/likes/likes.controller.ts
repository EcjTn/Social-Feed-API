import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import type { Request } from 'express';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/posts/:id')
  public async likePost(@Req() req: Request, @Param('id', ParseIntPipe)post_id: number) {
    const user = req.user as IJwtPayload
    return await this.likesService.addPostLike(user.sub, post_id)
  }


  @Delete('/posts/:id')
  public async unlikePost(@Req()req: Request, @Param('id', ParseIntPipe)post_id: number) {
    const user = req.user as IJwtPayload
    return await this.likesService.removePostLike(user.sub, post_id)
  }

}