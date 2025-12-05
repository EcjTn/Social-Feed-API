import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { IProfileData, IProfileDataPublic, IUserSearchData } from './interfaces/profile-data.interfaces';
import { Profile } from 'passport';
import { UserRole } from 'src/common/enums/user-role.enum';
import { IHistoryCommentData, IHistoryCommentResponse, IHistoryLikedPostsData, IHistoryLikedPostsResponse } from './interfaces/history-data.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) readonly usersRepo: Repository<Users>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    private readonly historyLimit = 5

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

    //Used for auths -- check bans, staffs, etc
    public findByUser(username: string, options?: { checkBanned: boolean }) {
        const where: any = { username }
        if (options?.checkBanned) { where.is_banned = false }

        return this.usersRepo.findOne({ where })
    }

    public addUser(username: string, password: string, email: string, avatar: string) {
        const newUser = this.usersRepo.create({ username, password, email, avatar })
        return this.usersRepo.save(newUser)
    }

    //only used for public purposes.
    public async getPublicProfile(username: string, currentUserId?: number): Promise<IProfileDataPublic> {
        const userCacheKey = `user:${username}:profile`

        const followedByMe = await this.usersRepo.createQueryBuilder('user')
            .innerJoin('follows', 'follow', 'follow.following_id = user.id')
            .where('follow.follower_id = :currentUserId', { currentUserId: currentUserId || 0 })
            .andWhere('user.username = :username', { username })
            .getCount() > 0; 

        const cachedProfile = await this.cacheManager.get<IProfileData>(userCacheKey)
        if (cachedProfile) return { ...cachedProfile, followedByMe };
        

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
            .where('user.username = :username', { username })
            .groupBy('user.id')

        const userInfo = await query.getRawOne<IProfileDataPublic>()
        if(!userInfo) throw new NotFoundException('User not found.')

        this.cacheManager.set(userCacheKey, userInfo, 60_000)
        
        return { ...userInfo, followedByMe };
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

    public async getLikedPosts(user_id: number, cursor?: number): Promise<IHistoryLikedPostsResponse> {
        const query = this.usersRepo.createQueryBuilder('user')
            .innerJoin('post_likes', 'like', 'like.user_id = user.id')
            .innerJoin('posts', 'post', 'post.id = like.post_id')
            .innerJoin(Users, 'ownerOfPost', 'ownerOfPost.id = post.user_id')
            .select([
                'like.id AS like_id',
                'post.id AS post_id',
                'ownerOfPost.username AS username',
                'ownerOfPost.avatar AS avatar',
                'post.title AS title',
                'post.content AS content',
                'post.created_at AS post_created_at',
                'like.created_at AS liked_at'
            ])
            .where('user.id = :user_id', { user_id })
            .limit(this.historyLimit)
            .orderBy('like.created_at', 'DESC')

        if (cursor) { query.andWhere('like.id < :cursor', { cursor }) }

        const likedPosts = await query.getRawMany<IHistoryLikedPostsData>()

        //Like ID for cursor pagination
        const nextCursor = likedPosts.length ? likedPosts[likedPosts.length - 1].like_id : null

        return { likedPosts, nextCursor }
    }

    public async getUserComments(user_id: number, cursor?: number): Promise<IHistoryCommentResponse> {
        const query = this.usersRepo.createQueryBuilder('user')
            .innerJoin('comments', 'comment', 'comment.user_id = user.id')
            .innerJoin('posts', 'post', 'post.id = comment.post_id')
            .select([
                'comment.id AS comment_id',
                'post.id AS post_id',
                'post.title AS post_title',
                'user.username AS username',
                'user.avatar AS avatar',
                'comment.content AS comment_content',
                'comment.created_at AS commented_at'
            ])
            .where('user.id = :user_id', { user_id })
            .limit(this.historyLimit)
            .orderBy('comment.created_at', 'DESC')

        if (cursor) { query.andWhere('comment.id < :cursor', { cursor }) }

        const comments = await query.getRawMany<IHistoryCommentData>()
        //Comment ID for cursor pagination
        const nextCursor = comments.length ? comments[comments.length - 1].comment_id : null

        return { comments, nextCursor }
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
