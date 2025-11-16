import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentDto } from './dto/comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  public async addComment(@User() user: IJwtPayload, data: CommentDto) {
    return await this.commentsService.add(user.sub, data.post_id, data.content)
  }

  @Post('/:parentCommentId/reply')
  public async addReply(@User() user: IJwtPayload, @Param('parentCommentId', ParseIntPipe) parentCommentId: number, @Body() data: ReplyCommentDto) {
    return await this.commentsService.addReply(user.sub, parentCommentId, data.content)
  }

  @Delete('/:commentId')
  public async deleteComment(@User() user: IJwtPayload, @Param('commentId', ParseIntPipe)commentId: number) {
    return this.commentsService.delete(user.sub, commentId)
  }

}
