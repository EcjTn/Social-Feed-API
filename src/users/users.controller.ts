import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import type { Request } from 'express';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { BioDto } from './dto/bio.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Get('/me')
    public async getCurrentInfo(@User() user: IJwtPayload){
        return await this.usersService.getOwnProfile(user.sub)
    }

    @Patch('/me/change-password')
    public async changeUserPassword(@User() user: IJwtPayload, @Body()data: ChangePasswordDto){
        return await this.usersService.changePassword(user.sub, data.newPassword)
    }

    @Patch('/bio')
    public async updateUserBio(@User() user: IJwtPayload, @Body() newBio: BioDto){
        return await this.usersService.updateBio(user.sub, newBio.bio)
    }

     @Get('/:username')
    public async getUserById(@Param('username') username: string){
        return await this.usersService.getPublicProfile(username)
    }

}
