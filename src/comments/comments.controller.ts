import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentDto } from './dto/comment.dto';
import { parseCursor } from 'src/utils/cursor-parser.utils';

@Controller('comments')
//@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  // Replies to a specific comment
  @Get('/:parentId/replies')
  public async getRepliesByParentId(@Param('parentId', ParseIntPipe) parent_id: number, @Query('cursor') cursor?: string) {
    return await this.commentsService.getRepliesByParentId(parent_id, parseCursor(cursor))
  }

  @Post('/:parentId/reply')
  public async addReply(@User() user: IJwtPayload, @Param('parentId', ParseIntPipe) parent_id: number, @Body() data: CommentDto) {
    return await this.commentsService.addReply(user.sub, parent_id, data.content)
  }

  @Delete('/:commentId')
  public async deleteComment(@User() user: IJwtPayload, @Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.delete(user.sub, commentId)
  }

}
