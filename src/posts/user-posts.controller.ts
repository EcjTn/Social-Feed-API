import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';


@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersPostController {
  constructor(private readonly postService: PostsService) {}

  @Get('/:username/posts')
  public async getUsersPost(@Param('username') username: string, @Query('cursor') cursor?: string){
    return await this.postService.getPostsByUsername(username, cursor)
  }
}
