import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { IProfileData, IProfileDataPublic, IUserSearchData } from './interfaces/profile-data.interfaces';
import { Profile } from 'passport';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) readonly usersRepo: Repository<Users>
    ) { }

    public async search(username: string, cursor?: number) {
        const limit = 10
        const query = this.usersRepo.createQueryBuilder('user')
            .select([
                'user.id AS id',
                'user.username AS username',
                'user.avatar AS avatar',
            ])
            .orderBy('user.id', 'ASC')
            .limit(limit)
            .groupBy('user.id')

        if (username) {
            query.where('user.username ILIKE :username', { username: `%${username}%` })
        }

        if (cursor) {
            query.andWhere('user.id > :cursor', { cursor })
        }

        const users = await query.getRawMany<IUserSearchData>()
        const nextCursor = users.length ? users[users.length - 1].id : null

        return { users, nextCursor }
    }

    //for finding user's existense
    public findById(id: number, checkBanned?: boolean | null) {
        if (!checkBanned) return this.usersRepo.findOne({ where: { id } })
        return this.usersRepo.findOne({ where: { id, is_banned: false } })
    }

    //Used for auths -- check bans
    public findByUser(username: string, options?: { checkBanned: boolean }) {
        const where: any = { username }
        if (options?.checkBanned) { where.is_banned = false }

        return this.usersRepo.findOne({ where })
    }

    public addUser(username: string, password: string, age: number, avatar: string) {
        const newUser = this.usersRepo.create({ username, password, age, avatar })
        return this.usersRepo.save(newUser)
    }

    //only used for public purposes.
    public async getPublicProfile(username: string, currentUserId?: number): Promise<IProfileDataPublic[]> {

        const query = this.usersRepo.createQueryBuilder('user')
            .leftJoin('posts', 'post', 'post.user_id = user.id')
            .leftJoin('follows', 'followers', 'followers.following_id = user.id')
            .leftJoin('follows', 'followings', 'followings.follower_id = user.id')
            .select([
                'user.id AS id',
                'user.username AS username',
                'user.avatar AS avatar',
                'user.role AS role',
                'user.is_banned AS isBanned',
                'user.bio AS bio'
            ])
            .addSelect('COUNT(DISTINCT post.id)', 'postCount')
            .addSelect('COUNT(DISTINCT followers.id)', 'followerCount')
            .addSelect('COUNT(DISTINCT followings.id)', 'followingCount')
            .addSelect(`
                EXISTS(
                    SELECT 1 FROM follows as f
                    WHERE f.follower_id = :currentUserId
                    AND f.following_id = user.id) AS "followedByMe"`)
                    .setParameter('currentUserId', currentUserId || 0)
            .where('user.username = :username', { username })
            .groupBy('user.id')

        const userInfo = await query.getRawMany<IProfileDataPublic>()
        return userInfo
    }

    //for /users/me
    public async getOwnProfile(id: number): Promise<IProfileData[]> {
        const query = this.usersRepo.createQueryBuilder('user')
            .leftJoin('posts', 'post', 'post.user_id = user.id')
            .leftJoin('follows', 'followers', 'followers.following_id = user.id')
            .leftJoin('follows', 'followings', 'followings.follower_id = user.id')
            .select([
                'user.id AS id',
                'user.username AS username',
                'user.avatar AS avatar',
                'user.role AS role',
                'user.is_banned AS isBanned',
                'user.bio AS bio'
            ])
            .addSelect('COUNT(DISTINCT post.id)', 'postCount')
            .addSelect('COUNT(DISTINCT followers.id)', 'followerCount')
            .addSelect('COUNT(DISTINCT followings.id)', 'followingCount')
            .where('user.id = :id', { id })
            .groupBy('user.id')

        const userInfo = await query.getRawMany<IProfileData>()
        return userInfo
    }

    public async updateBio(id: number, bio: string) {
        const userRecord = await this.usersRepo.findOne({ where: { id } })

        if (!userRecord) throw new NotFoundException('User not found.')

        userRecord.bio = bio
        await this.usersRepo.save(userRecord)

        return { message: 'Bio updated!' }
    }

    public async changePassword(id: number, password: string) {
        const userRecord = await this.usersRepo.findOne({ where: { id }, select: ['password'] })
        if (!userRecord) throw new NotFoundException()

        const saltRound = 10
        userRecord.password = await bcrypt.hash(password, saltRound)

        await this.usersRepo.save(userRecord)

        return { message: 'Successfully changed password.' }
    }

    public async deleteUserById(id: number) {
        const result = await this.usersRepo.delete({ id });
        if(!result.affected) throw new BadRequestException('User not found.')

        return { message: 'Successfully deleted user.' };
    }

    //Promote user to admin(Below are mostly used for StaffModule)
    public async promoteToAdmin(id: number) {
        const userRecord = await this.findById(id)
        if (!userRecord) throw new NotFoundException('User not found.')

        userRecord.role = UserRole.Admin
        await this.usersRepo.save(userRecord)

        return { message: 'Successfully promoted user to admin.' }
    }

    public async promoteToModerator(id: number) {
        const userRecord = await this.findById(id)
        if (!userRecord) throw new NotFoundException('User not found.')

        userRecord.role = UserRole.Moderator
        await this.usersRepo.save(userRecord)

        return { message: 'Successfully promoted user to moderator.' }
    }

    public async demoteToUser(id: number) {
        const userRecord = await this.findById(id)
        if (!userRecord) throw new NotFoundException('User not found.')

        userRecord.role = UserRole.User
        await this.usersRepo.save(userRecord)

        return { message: 'Successfully demoted user to user.' }
    }

    public async banUserById(id: number) {
        const userRecord = await this.findById(id, true)
        if (!userRecord) throw new NotFoundException('User not found or already banned.')

        userRecord.is_banned = true
        await this.usersRepo.save(userRecord)

        return { message: 'Successfully banned user.' }
    }

    public async unbanUserById(id: number) {
        const userRecord = await this.findById(id)
        if (!userRecord) throw new NotFoundException('User not found.')

        userRecord.is_banned = false
        await this.usersRepo.save(userRecord)

        return { message: 'Successfully unbanned user.' }
    }

}
