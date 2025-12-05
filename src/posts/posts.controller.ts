import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { NewPostDto } from './dto/new-post.dto';
import { EditPostDto } from './dto/edit-post.dto';
import { User } from 'src/common/decorators/user.decorator';
import { parseCursor } from 'src/utils/cursor-parser.util';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postService: PostsService) { }

  @Post()
  public async create(@User() user: IJwtPayload, @Body() post: NewPostDto) {
    return await this.postService.addPost(user.sub, post.title, post.content)
  }


  @Get()
  public async getPosts(@User() user: IJwtPayload,@Query('cursor') cursor?: string) {
    return this.postService.getPosts(user.sub, undefined, parseCursor(cursor))
  }

  @Get('/:id')
  public async getPost(@User() user: IJwtPayload, @Param('id', ParseIntPipe) post_id: number) {
    return await this.postService.getPostById(post_id, user.sub)
  }

  @Delete('/:id')
  public async delete(@User() user: IJwtPayload, @Param('id', ParseIntPipe) post_id: number) {
    return await this.postService.removePost(user.sub, post_id)
  }

  @Patch('/:id')
  public async editPost(
    @Param('id', ParseIntPipe) post_id: number,
    @User() user: IJwtPayload,
    @Body() data: EditPostDto) {
    return await this.postService.editPost(user.sub, post_id, data.updatedContent)
  }

}



