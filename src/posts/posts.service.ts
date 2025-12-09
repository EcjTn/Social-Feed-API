import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entity/post.entity';
import { UsersService } from 'src/users/users.service';
import { verifyRecaptcha } from 'src/auth/utils/recaptcha.util';
import { IUserFilter } from '../common/interfaces/user-filter.interface';
import { IPostData, IPostDataResponse } from './interfaces/post-data.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) private readonly postsRepo: Repository<Posts>,
        private readonly usersService: UsersService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    private readonly postsCacheTTL = 120_000; // 2 minutes

    public async addPost(user_id: number, title: string, content: string, privatePost: boolean = false) {
        const userRecord = await this.usersService.findById(user_id, true)
        if (!userRecord) throw new BadRequestException('User not found.')

        const newPost = this.postsRepo.create({
            title,
            content,
            user: userRecord,
            private: privatePost
        })
        await this.postsRepo.save(newPost)

        return { message: 'Successfully added post!' }
    }

    public async removePost(user_id: number, post_id: number) {
        const result = await this.postsRepo.delete({
            user: { id: user_id },
            id: post_id
        })
        if (!result.affected) throw new BadRequestException()

        return { message: 'Successfully deleted post!' }
    }

    public async editPost(user_id: number, post_id: number, content?: string, privatePost?: boolean) {
        const post = await this.postsRepo.createQueryBuilder('post')
            .where('post.id = :post_id', { post_id })
            .andWhere('post.user_id = :user_id', { user_id })
            .getOne()

        if (!post) throw new BadRequestException('Post not found or you do not have permission to edit it.')

        if (content !== undefined) { post.content = content }
        if (privatePost !== undefined) { post.private = privatePost }

        await this.postsRepo.save(post)

        return { message: 'Successfully edited post.' };
    }

    public async getPosts(user_id: number, filter?: IUserFilter, cursor?: number): Promise<IPostDataResponse> {
        const cachKey = filter ? `posts:filter:${JSON.stringify(filter)}:cursor:${cursor || 0}`
            : `posts:cursor:${cursor || 0}`;

        const loadLimit = 5

        const query = this.postsRepo.createQueryBuilder('post')
            .leftJoin('post.comments', 'comments')
            .innerJoin('post.user', 'user')
            .leftJoin('post.likes', 'likes')
            .select([
                'user.username AS username',
                'user.avatar AS avatar',
                'post.id AS id',
                'post.title AS title',
                'post.content AS content',
                'post.created_at AS created_at',
                'post.private AS private',
            ])
            .addSelect('COUNT(DISTINCT comments.id)', 'commentCount')
            .addSelect('COUNT(DISTINCT likes.id)', 'likeCount')
            .setParameter('userId', user_id)
            .groupBy('post.id')
            .addGroupBy('user.id')
            .orderBy('post.id', 'DESC')
            .limit(loadLimit)

        if(!filter?.username && !filter?.userId) query.andWhere('post.private = :isPrivate', { isPrivate: false }) 

        if (filter?.username) {
            query.andWhere('user.username = :username', { username: filter.username })
            query.andWhere('post.private = :isPrivate', { isPrivate: false })
        }

        if (filter?.userId) query.andWhere('post.user_id = :userId', { userId: filter.userId })


        if (cursor) {
            query.andWhere('post.id < :cursor', { cursor })
        }

        const posts = await query.getRawMany<IPostData>()
        const nextCursor = posts.length ? posts[posts.length - 1].id : null

        return { posts, nextCursor }
    }

    public async getPostById(post_id: number, user_id: number, showPrivate?: boolean): Promise<IPostData> {
        const cacheKey = `post:${post_id}:metadata`;
        const likedByMe = await this.postsRepo.createQueryBuilder('post')
            .innerJoin('post.likes', 'likes')
            .where('post.id = :post_id', { post_id })
            .andWhere('likes.user_id = :user_id', { user_id })
            .getCount() > 0;

        const cachedPost = await this.cacheManager.get<IPostData>(cacheKey);
        if (cachedPost) return { ...cachedPost, likedByMe }

        const query = this.postsRepo.createQueryBuilder('post')
            .leftJoin('post.comments', 'comments')
            .innerJoin('post.user', 'user')
            .leftJoin('post.likes', 'likes')
            .select([
                'user.username AS username',
                'user.avatar AS avatar',
                'post.id AS id',
                'post.title AS title',
                'post.content AS content',
                'post.created_at AS created_at',
            ])
            .addSelect('COUNT(DISTINCT comments.id)', 'commentCount')
            .addSelect('COUNT(DISTINCT likes.id)', 'likeCount')
            .where('post.id = :post_id', { post_id })
            .groupBy('post.id')
            .addGroupBy('user.id')

        if (showPrivate) { query.andWhere('post.private = :isPrivate', { isPrivate: true }) }
        else { query.andWhere('post.private = :isPrivate', { isPrivate: false }) }

        const post = await query.getRawOne<IPostData>();

        if (!post) throw new BadRequestException('Post not found.')

        await this.cacheManager.set(cacheKey, post, this.postsCacheTTL)

        return { ...post, likedByMe };
    }

    public async removePostForce(post_id: number) {
        const result = await this.postsRepo.delete({ id: post_id });
        if (!result.affected) {
            throw new BadRequestException('Post not found.');
        }

        return { message: 'Post force deleted successfully.' };
    }

}
