import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SetRoleDto } from './dtos/set-role.dto';
import { UsersService } from 'src/users/users.service';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly usersService: UsersService,
  ) {}

  @Patch('/users/:id/role')
  @Roles(UserRole.Admin)
  public async setUserRole(@Param('id', ParseIntPipe) id: number, @Body() data: SetRoleDto) {
    return this.staffService.setRole(id, data.role)
  }

  @Delete('/users/:id/delete')
  @Roles(UserRole.Admin)
  public async getUserData(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUserById(id)
  }

}
