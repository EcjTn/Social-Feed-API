import { Controller, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentDto } from './dto/comment.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  public async addComment(@User() user: IJwtPayload, data: CommentDto) {
    return await this.commentsService.add(user.sub, data.post_id, data.content)
  }


}
