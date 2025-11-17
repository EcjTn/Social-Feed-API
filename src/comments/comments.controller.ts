import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentDto } from './dto/comment.dto';

@Controller('posts/:postId/comments')
//@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  //Top-level comments
  @Get()
  public async getCommentsByPostId(@Param('postId', ParseIntPipe)post_id: number, @Query('cursor') cursor?: string) {
    const parsedCursor = cursor ? parseInt(cursor, 10) : undefined
    return await this.commentsService.getCommentsByPostId(post_id, parsedCursor)
  }

  // Replies to a specific comment
  @Get('/:parentId/replies')
  public async getRepliesByParentId(@Param('parentId', ParseIntPipe)parent_id: number, @Query('cursor')cursor?: string){
    const parsedCursor = cursor ? parseInt(cursor, 10) : undefined
    return await this.commentsService.getRepliesByParentId(parent_id, parsedCursor)
  }

  @Post()
  public async addComment(@Param('postId', ParseIntPipe)post_id: number, @User() user: IJwtPayload, data: CommentDto) {
    return await this.commentsService.add(user.sub, post_id, data.content)
  }

  @Post('/:parentId/reply')
  public async addReply(@User() user: IJwtPayload, @Param('parentId', ParseIntPipe) parent_id: number, @Body() data: CommentDto) {
    return await this.commentsService.addReply(user.sub, parent_id, data.content)
  }

  @Delete('/:commentId')
  public async deleteComment(@User() user: IJwtPayload, @Param('commentId', ParseIntPipe)commentId: number) {
    return this.commentsService.delete(user.sub, commentId)
  }

}
