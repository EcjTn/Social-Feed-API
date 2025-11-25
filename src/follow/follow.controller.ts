import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { parseCursor } from 'src/utils/cursor-parser.util';

@Controller('/users')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('/me/followers')
  public async getMyFollowers(@User()user: IJwtPayload, @Query('cursor')cursor?: string) {
    return this.followService.getFollowers({userId: user.sub}, parseCursor(cursor))
  }

  @Get('/me/following')
  public async getMyFollowings(@User()user: IJwtPayload, @Query('cursor')cursor?: string) {
    return await this.followService.getFollowing({userId: user.sub}, parseCursor(cursor))
  }

  @Get('/:username/followers')
  public async getUsersFollowers(@Param('username')username: string, @Query('cursor')cursor?: string) {
    return await this.followService.getFollowers({username}, parseCursor(cursor))
  }

  @Get('/:username/followings')
  public async getUsersFollowing(@Param('username')username: string, @Query('cursor')cursor?: string) {
    return await this.followService.getFollowing({username}, parseCursor(cursor))
  }

  @Post('/:username/follow')
  public async followUser(@User()user: IJwtPayload, @Param('username')username: string) {
    return await this.followService.follow(user.sub, username)
  }

  @Delete('/:username/unfollow')
  public async unfollowUser(@User()user: IJwtPayload, @Param('username')username: string) {
    return await this.followService.unfollow(user.sub, username)
  }

}
