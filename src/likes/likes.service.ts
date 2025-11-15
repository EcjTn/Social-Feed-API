import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PG_INT_LIMITS } from 'src/common/constants/pg-int-limits';
import { PostLikes } from './entities/post-likes.entity';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(PostLikes) private readonly postLikesRepo: Repository<PostLikes>
    ) { }

    public async addPostLike(user_id: number, post_id: number) {
        if (post_id > PG_INT_LIMITS.MINIMUM_LENGTH || post_id < PG_INT_LIMITS.MINIMUM_LENGTH) throw new BadRequestException()

        try {
            const likeExists = await this.postLikesRepo.findOne({
                where: { user: { id: user_id }, post: { id: post_id } }
            })

            if (likeExists) throw new BadRequestException('Already liked post.')

            const newLike = this.postLikesRepo.create({
                post: { id: post_id },
                user: { id: user_id }
            })
            await this.postLikesRepo.save(newLike)

            return { message: 'Successfully liked post.' }
        } catch (err) {
            console.log("POST ERR:", err)
            throw new BadRequestException('Could not like post.')
        }
    }

    public async removePostLike(user_id: number, post_id: number) {
        if (post_id > PG_INT_LIMITS.MINIMUM_LENGTH || post_id < PG_INT_LIMITS.MINIMUM_LENGTH) throw new BadRequestException()

        try {
            const deleteLike = await this.postLikesRepo.delete({
                user: {id: user_id},
                post: {id: post_id}
            })
            if(!deleteLike.affected) throw new BadRequestException('You did not like this post.')

            return {message: 'Successfully unliked post.'}

        } catch (err) {
            console.log("POST ERR:", err)
            throw new BadRequestException('Could not unlike post.')
        }


    }



}
