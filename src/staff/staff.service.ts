import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CommentsService } from 'src/comments/comments.service';
import { UserRole } from 'src/common/enums/user-role.enum';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StaffService {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    public async getUserData(id: number, currentUserId: number) {
        const user = await this.usersService.findById(id)
        if(!user) throw new BadRequestException('User not found.')

        const publicData = await this.usersService.getPublicProfile(user.username, currentUserId)

        return { user, publicData }
    }

    public async setRole(id: number, role: string) {
        const userRecord = await this.usersService.findById(id)
        if (!userRecord) throw new Error('User not found.')

        switch (role) {
            case UserRole.Admin:
                return this.usersService.promoteToAdmin(id)
            case UserRole.Moderator:
                return this.usersService.promoteToModerator(id)
            case UserRole.User:
                return this.usersService.demoteToUser(id)
            default:
                throw new BadRequestException('Invalid role.')
        }

    }

    public async banUser(id: number) {
        try {
            await this.usersService.banUserById(id)
            await this.authService.removeTokensByUserId(id)
            return { message: 'User banned successfully.' }
        }
        catch (err) {
            console.error("Ban-User-Error: ", err)
            throw new BadRequestException('Failed to ban user.')
        }
    }

}
