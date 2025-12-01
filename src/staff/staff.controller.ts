import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SetRoleDto } from './dtos/set-role.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { CommentsService } from 'src/comments/comments.service';
import { PostsService } from 'src/posts/posts.service';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
  private readonly postsService: PostsService,
  ) {}

  @Get('/users/:id')
  @Roles(UserRole.Admin)
  public async getUserData(@Param('id', ParseIntPipe) id: number, @User()user: IJwtPayload) {
    return this.staffService.getUserData(id, user.sub)
  }

  @Patch('/users/:id/ban')
  @Roles(UserRole.Admin, UserRole.Moderator)
  public async banUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.banUserById(id)
  }

  @Patch('/users/:id/unban')
  @Roles(UserRole.Admin)
  public async unbanUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unbanUserById(id)
  }

  @Patch('/users/:id/role')
  @Roles(UserRole.Admin)
  public async setUserRole(@Param('id', ParseIntPipe) id: number, @Body() data: SetRoleDto) {
    return this.staffService.setRole(id, data.role)
  }

  @Delete('/users/:id/')
  @Roles(UserRole.Admin)
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUserById(id)
  }

  @Delete('/comments/:id/')
  @Roles(UserRole.Admin, UserRole.Moderator)
  public async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.deleteCommentForce(id)
  }

  @Delete('/posts/:id/')
  @Roles(UserRole.Admin)
  public async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.removePostForce(id)
  }

}
