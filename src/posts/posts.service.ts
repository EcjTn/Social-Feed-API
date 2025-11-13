import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entity/post.entity';
import { RecaptchaService } from 'src/recaptcha/recaptcha.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) private readonly postsRepo: Repository<Posts>,
        private readonly usersService: UsersService,
        private readonly recaptchaService: RecaptchaService,
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

    public async getPosts(cursor?: number) {
        try {
            const limitPosts = 5

            const query = this.postsRepo.createQueryBuilder('post')
                .innerJoin('post.user', 'user')
                .leftJoin('post.likes', 'likes')
                .select([
                    'user.username AS username',
                    'post.id AS id',
                    'post.title AS title',
                    'post.content AS content',
                    'post.created_at AS created_At'
                ])
                .addSelect('COUNT(likes.id)', 'likes')
                .groupBy('post.id')
                .addGroupBy('user.username')
                .orderBy('post.id', 'DESC')
                .limit(limitPosts)

            if (cursor) {
                query.where('post.id < :cursor', {cursor})
            }

            const posts = await query.getRawMany()
            const nextCursor = posts.length ? posts[posts.length - 1].id : null

            return { posts, nextCursor }
        }
        catch(e) {
            console.log("Pagination Error:", e)
            return { posts: [], cursor: null };
        }
    }

    public async getPostsByUsername(username: string, cursor?: number){
        try{
            const loadUsersPostLimit = 5

            const query = this.postsRepo.createQueryBuilder('post')
                .innerJoin('post.user', 'user')
                .leftJoin('post.likes', 'likes')
                .select([
                    'user.username AS username',
                    'post.id AS id',
                    'post.title AS title',
                    'post.content AS content',
                    'post.created_at AS created_at',
                ])
                .addSelect('COUNT(likes.id)', 'likes')
                .where('username = :username', {username})
                .groupBy('post.id')
                .orderBy('id', 'DESC')
                .addGroupBy('user.username')
                .limit(loadUsersPostLimit)


            if(cursor){
                query.andWhere('post.id < :cursor', {cursor})
            }

            const posts = await query.getRawMany()
            const nextCursor = posts.length ? posts[posts.length - 1].id : null

            return {posts, nextCursor}
        }catch(e){
            console.log("GET-USERS-POST ERROR: ", e)
            return {posts: [], cursor: null}
        }
    }

}
