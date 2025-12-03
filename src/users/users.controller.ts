import { Body, Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import type { Request } from 'express';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { BioDto } from './dto/bio.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/common/decorators/user.decorator';
import { parse } from 'path';
import { parseCursor } from 'src/utils/cursor-parser.util';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Get('/search/:username')
    public async searchUsers(@Param('username') username: string, @Query('cursor') cursor?: string) {
        return await this.usersService.search(username, parseCursor(cursor))
    }

    @Get('/me')
    public async getCurrentInfo(@User() user: IJwtPayload){
        return await this.usersService.getOwnProfile(user.sub)
    }

    @Get('/me/history/liked-posts')
    public async getLikedPosts(@User() user: IJwtPayload, @Query('cursor') cursor?: string){
        return await this.usersService.getLikedPosts(user.sub, parseCursor(cursor))
    }

    @Get('/me/history/comments')
    public async getUserComments(@User() user: IJwtPayload, @Query('cursor') cursor?: string){
        return await this.usersService.getUserComments(user.sub, parseCursor(cursor))
    }

    @Patch('/me/change-password')
    public async changeUserPassword(@User() user: IJwtPayload, @Body()data: ChangePasswordDto){
        return await this.usersService.changePassword(user.sub, data.newPassword)
    }

    @Patch('/bio')
    public async updateUserBio(@User() user: IJwtPayload, @Body() newBio: BioDto){
        return await this.usersService.updateBio(user.sub, newBio.bio)
    }

    @Delete('/me/delete')
    public async deleteUser(@User() user: IJwtPayload){
        return await this.usersService.deleteUserById(user.sub)
    }

     @Get('/:username')
    public async getUserById(@User() user: IJwtPayload,@ Param('username') username: string){
        return await this.usersService.getPublicProfile(username, user.sub)
    }

}
