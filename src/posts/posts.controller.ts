import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { Request } from 'express';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { NewPostDto } from './dto/new-post.dto';
import { EditPostDto } from './dto/edit-post.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postService: PostsService) { }

  @Post()
  public async create(@Req() req: Request, @Body() post: NewPostDto) {
    const user = req.user as IJwtPayload
    return await this.postService.add(user.sub, post.title, post.content, post.recaptchaToken)
  }


  @Get()
  public async getPosts(@Query('cursor') cursor?: string) {
    return this.postService.getPosts(cursor)
  }

  @Delete('/:id')
  public async delete(@Req() req: Request, @Param('id', ParseIntPipe) post_id: number) {
    const user = req.user as IJwtPayload
    return await this.postService.remove(user.sub, post_id)
  }

  @Patch('/:id')
  public async editPost(
    @Param('id', ParseIntPipe) post_id: number,
    @Req() req: Request,
    @Body() data: EditPostDto) {
    const user = req.user as IJwtPayload
    return await this.postService.edit(user.sub, post_id, data.updatedContent)
  }

}
