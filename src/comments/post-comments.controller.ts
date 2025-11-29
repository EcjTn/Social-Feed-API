import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentDto } from './dto/comment.dto';
import { parseCursor } from 'src/utils/cursor-parser.util';

@Controller('posts/:id/comments')
@UseGuards(JwtAuthGuard)
export class PostCommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Get()
  public async getCommentsByPostId(
    @User() user: IJwtPayload,
    @Param('id', ParseIntPipe) postId: number,
    @Query('cursor') cursor?: string
  ) {
    return this.commentsService.getCommentsByPostId(user.sub, postId, parseCursor(cursor));
  }

  @Post()
  public async addComment(
    @Param('id', ParseIntPipe) postId: number,
    @User() user: IJwtPayload,
    @Body() data: CommentDto
  ) {
    return this.commentsService.add(user.sub, postId, data.content);
  }
}





