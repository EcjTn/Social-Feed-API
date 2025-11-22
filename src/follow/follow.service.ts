import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entity/follows.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { IUserFilter } from 'src/common/interfaces/user-filter.interface';
import { IFollowData, IFollowDataResponse } from './interfaces/follow-data.interface';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(Follow) private readonly followRepo: Repository<Follow>,
        private readonly usersService: UsersService
    ) { }

    public async follow(follower_id: number, followingUsername: string) {
        const targetUser = await this.usersService.findByUser(followingUsername)
        if (!targetUser) throw new NotFoundException('Target user not found.')


        if (follower_id === targetUser?.id) throw new BadRequestException('You cannot follow yourself.')

        const existingFollow = await this.followRepo.findOne({ where: { follower: { id: follower_id }, following: { id: targetUser?.id } } })
        if (existingFollow) throw new BadRequestException('Already following this user.')

        try {
            const newFollow = this.followRepo.create({
                follower: { id: follower_id },
                following: { id: targetUser?.id }
            })
            await this.followRepo.save(newFollow)

            return { message: 'Successfully followed user.' }
        }
        catch (e) {
            console.log("FOLLOW-ADD ERROR:", e)
            throw new InternalServerErrorException('Failed to follow user.')
        }
    }

    public async unfollow(follower_id: number, followingUsername: string) {
        const targetUser = await this.usersService.findByUser(followingUsername)
        try {
            const result = await this.followRepo.delete({
                follower: { id: follower_id },
                following: { id: targetUser?.id }
            })
            if (!result.affected) throw new BadRequestException('You did not follow this user.')

            return { message: 'Successfully unfollowed user.' }
        }
        catch(e) {
            console.log("REMOVE FOLLOW ERROR:", e)
            throw new InternalServerErrorException('Failed to unfollow user.')
        }

    }

    public async getFollowers(filter?: IUserFilter, cursor?: number): Promise<IFollowDataResponse> {
        const limitLoad = 20
        const query = this.followRepo.createQueryBuilder('follow')
            .innerJoin('follow.following', 'user')
            .innerJoin('follow.follower', 'follower')
            .select(['follower.username AS username', 'follow.id AS id'])
            .orderBy('follow.id', 'DESC')
            .limit(limitLoad)

        try {
            if (filter?.userId) { query.andWhere('user.id = :userId', { userId: filter.userId }) }
            if (filter?.username) { query.andWhere('user.username = :username', { username: filter.username }) }

            if (cursor) { query.andWhere('follow.id < :cursor', { cursor }) }
            const followers = await query.getRawMany<IFollowData>()

            const nextCursor = followers ? followers[followers.length - 1].id : null

            return { followers, nextCursor }
        }
        catch (e) {
            console.log("LOAD-FOLLOWERS ERROR:", e)
            return { followers: [], nextCursor: null }
        }
    }


}