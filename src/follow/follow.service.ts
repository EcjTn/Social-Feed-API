import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entity/follows.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(Follow) private readonly followRepo: Repository<Follow>,
        private readonly usersService: UsersService
    ){}

    public async follow(follower_id: number, following_id: number) {
        if(follower_id === following_id) { throw new BadRequestException('Cannot follow yourself.') }

        const followerRecord = await this.usersService.findById(follower_id)
        if(!followerRecord) throw new BadRequestException('User not found.')

        const existingFollow = await this.followRepo.findOne({
            where: { follower: {id: follower_id}, following: {id: following_id}}
        })
        if(existingFollow) throw new ConflictException('You are already following this user.')

        try {
            const newFollow = this.followRepo.create({
                follower: followerRecord,
                following: {id: following_id}
            })
            await this.followRepo.save(newFollow)

            return {message: 'Successfully followed user.'}
        }
        catch(e) {
            console.log("ADD-FOLLOW ERROR:", e)
            throw new InternalServerErrorException('Could not follow user.')
        }

    }

    public async unfollow(follower_id: number, following_id: number) {
        const result = await this.followRepo.delete({
            follower: {id: follower_id},
            following: {id: following_id}
        })
        if(!result.affected) throw new BadRequestException('You did not like this post.')

        return {message: 'Successfully unliked post.'}
    }

}
