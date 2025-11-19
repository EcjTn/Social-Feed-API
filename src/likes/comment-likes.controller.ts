import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('comments/:id/like')
@UseGuards(JwtAuthGuard)
export class CommentLikesController {
    constructor(private readonly likesService: LikesService) { }

    @Post()
    public async addCommentLike(@User() user: IJwtPayload, @Param('id', ParseIntPipe) commentId: number) {
        return await this.likesService.addCommentLike(user.sub, commentId)
    }

    @Delete()
    public async removeCommentLike(@User() user: IJwtPayload, @Param('id', ParseIntPipe) commentId: number) {
        return await this.likesService.removeCommentLike(user.sub, commentId)
    }

}