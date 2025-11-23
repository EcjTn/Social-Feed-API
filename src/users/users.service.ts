import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { IProfileData, IPublicProfileData } from './interfaces/profile-data.interfaces';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) readonly usersRepo: Repository<Users>
    ) { }

    //for finding user's existense
    public findById(id: number) {
        return this.usersRepo.findOne({ where: { id }, select: ['id'] })
    }

    //Used for auths -- check bans
    public findByUser(username: string, options?: { checkBanned: boolean }) {
        const where: any = { username }
        if (options?.checkBanned) { where.is_banned = false }

        return this.usersRepo.findOne({ where })
    }

    public add(username: string, password: string, age: number) {
        const newUser = this.usersRepo.create({ username, password, age })
        return this.usersRepo.save(newUser)
    }

    //only used for public purposes.
    public async getPublicProfile(username: string): Promise<IPublicProfileData[]> {
        const query = this.usersRepo.createQueryBuilder('user')
            .leftJoin('posts', 'post', 'post.user_id = user.id')
            .leftJoin('follows', 'followers', 'followers.following_id = user.id')
            .leftJoin('follows', 'followings', 'followings.follower_id = user.id')
            .select([
                'user.username AS username',
                'user.role AS role',
                'user.is_banned AS isBanned',
                'user.bio AS bio'
            ])
            .addSelect('COUNT(DISTINCT post.id)', 'postCount')
            .addSelect('COUNT(DISTINCT followers.id)', 'followerCount')
            .addSelect('COUNT(DISTINCT followings.id)', 'followingCount')
            .where('user.username = :username', { username })
            .groupBy('user.id')

        const userInfo = await query.getRawMany<IPublicProfileData>()
        return userInfo
    }

    //for /users/me
    public async getOwnProfile(id: number): Promise<IProfileData[]> {
        const query = this.usersRepo.createQueryBuilder('user')
            .leftJoin('posts', 'post', 'post.user_id = user.id')
            .leftJoin('follows', 'followers', 'followers.following_id = user.id')
            .leftJoin('follows', 'followings', 'followings.follower_id = user.id')
            .select([
                'user.username AS username',
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

        if (!userRecord) throw new NotFoundException()

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


}
