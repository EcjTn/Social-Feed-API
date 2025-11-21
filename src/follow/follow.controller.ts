import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { parseCursor } from 'src/utils/cursor-parser.utils';

@Controller('/users/:username/')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('/followers')
  public async getUsersFollowers(@Param('username')username: string, @Query('cursor')cursor?: string) {
    const parsedCursor = parseCursor(cursor)
    return await this.followService.getFollowers({username}, parsedCursor)
  }

  @Post('/follow')
  public async followUser(@User()user: IJwtPayload, @Param('username')username: string) {
    return await this.followService.follow(user.sub, username)
  }

  @Delete('/unfollow')
  public async unfollowUser(@User()user: IJwtPayload, @Param('username')username: string) {
    return await this.followService.unfollow(user.sub, username)
  }

}
