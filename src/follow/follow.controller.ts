import { Controller, Delete, Param, Post } from '@nestjs/common';
import { FollowService } from './follow.service';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('/users/:username/')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/follow')
  public followUser(@User()user: IJwtPayload, @Param('username')username: string) {}

  @Delete('/unfollow')
  public unfollowUser(@User()user: IJwtPayload, @Param('username')username: string) {}

}
