import { Controller, Get, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('staff')
@UseGuards(RolesGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('/test')
  @Roles(UserRole.Admin, UserRole.Moderator)
  public async getTest() {
    return { message: 'Staff endpoint is working!' };
  }

}
