import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entity/post.entity';
import { RecaptchaService } from 'src/recaptcha/recaptcha.service';
import { UsersService } from 'src/users/users.service';
import Hashids from 'hashids'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) private readonly postsRepo: Repository<Posts>,
        private readonly usersService: UsersService,
        private readonly recaptchaService: RecaptchaService,
        private readonly configService: ConfigService
    ) { }

    public async add(user_id: number, title: string, content: string, recaptchaToken: string) {

        const validateRecaptchaToken = await this.recaptchaService.validateToken(recaptchaToken)
        if (!validateRecaptchaToken) throw new UnauthorizedException()

        const userRecord = await this.usersService.findById(user_id)
        if (!userRecord) throw new ForbiddenException()

        const newPost = this.postsRepo.create({
            title,
            content,
            user: userRecord
        })
        await this.postsRepo.save(newPost)

        return { message: 'Successful!' }
    }

    public async remove(user_id: number, post_id: number) {
        const result = await this.postsRepo.delete({
            user: { id: user_id },
            id: post_id
        })
        if (!result.affected) throw new BadRequestException()

        return { message: 'Successfully deleted post!' }
    }

    public async edit(user_id: number, post_id: number, content: string) {
        const result = await this.postsRepo.update(
            { user: { id: user_id }, id: post_id },
            { content },
        );

        if (!result.affected) {
            throw new BadRequestException('Post not found or not editable');
        }

        return { message: 'Successfully edited post.' };
    }

    public async getPosts(cursor?: string) {
        try {
            const limitPosts = 5
            const cursorStringLength = 10

            const hashSalt = await this.configService.getOrThrow('HASH_SALT')
            const hashIds = new Hashids(hashSalt, cursorStringLength)

            const query = this.postsRepo.createQueryBuilder('post')
                .innerJoin('post.user', 'user')
                .leftJoin('post.likes', 'likes')
                .select([
                    'post.id',
                    'post.title',
                    'post.content',
                    'post.created_at',
                    'user.username'
                ])
                .addSelect('COUNT(likes.id)', 'likesCount')
                .groupBy('post.id')
                .addGroupBy('user.username')
                .orderBy('post.id', 'DESC')
                .limit(limitPosts)

            const decodedCursor = hashIds.decode(cursor ?? '')[0]
            if (decodedCursor) {
                query.where('post.id < :decodedCursor', { decodedCursor })
            }

            const posts = await query.getRawMany()

            //Last post ID as a cursor
            const nextCursor: number | null = posts.length ? posts[posts.length - 1].post_id : null
            const encodedCursor = nextCursor !== null ? hashIds.encode(nextCursor) : null

            return { posts, cursor: encodedCursor }
        }
        catch(e) {
            console.log("Pagination Error", e)
            return { posts: [], cursor: null };
        }
    }

}
