import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { PostsService } from "./posts.service"
import { User } from "src/common/decorators/user.decorator"
import type { IJwtPayload } from "src/common/interfaces/jwt-payload.interface"
import { parseCursor } from "src/utils/cursor-parser.util"

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserPostsController {
  constructor(private readonly postService: PostsService) { }

  @Get('/me/posts')
  public async getMyPost(@User() user: IJwtPayload, @Query('cursor')cursor?: string) {
    return await this.postService.getPosts(user.sub, {userId: user.sub}, parseCursor(cursor))
  }

  @Get('/:username/posts')
  public async getUsersPost(@User() user: IJwtPayload, @Param('username') username: string, @Query('cursor') cursor?: string) {
    return await this.postService.getPosts(user.sub, {username}, parseCursor(cursor))
  }
}