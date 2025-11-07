import { Body, Controller, Get, Param, ParseIntPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import type { Request } from 'express';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { BioDto } from './dto/bio.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Get('/me')
    public async getCurrentInfo(@Req() req: Request){
        const user = req.user as IJwtPayload
        return await this.usersService.getOwnProfile(user.sub)
    }

    @Patch('/bio')
    public updateUserBio(@Req() req: Request, @Body('bio') newBio: BioDto){
        const user = req.user as IJwtPayload
        return this.usersService.updateBio(user.sub, newBio.bio)
    }

     @Get('/:username')
    public async getUserById(@Param('username') username: string){
        return await this.usersService.getPublicProfile(username)
    }

}
