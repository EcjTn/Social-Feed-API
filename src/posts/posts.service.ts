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

    public async addPost(user_id: number, title: string, content: string) {
        const userRecord = await this.usersService.findById(user_id, true)
        if (!userRecord) throw new BadRequestException('User not found.')

        const newPost = this.postsRepo.create({
            title,
            content,
            user: userRecord
        })
        await this.postsRepo.save(newPost)

        return { message: 'Successful!' }
    }

    public async removePost(user_id: number, post_id: number) {
        const result = await this.postsRepo.delete({
            user: { id: user_id },
            id: post_id
        })
        if (!result.affected) throw new BadRequestException()

        return { message: 'Successfully deleted post!' }
    }

    public async editPost(user_id: number, post_id: number, content?: string, visibility?: boolean) {
        const post = await this.postsRepo.createQueryBuilder('post')
            .where('post.id = :post_id', { post_id })
            .andWhere('post.user_id = :user_id', { user_id })
            .getOne()

        if (!post) throw new BadRequestException('Post not found or you do not have permission to edit it.')
        
        if(content !== undefined) { post.content = content }
        if(visibility !== undefined) { post.private = visibility }

        await this.postsRepo.save(post)

        return { message: 'Successfully edited post.' };
    }

    public async getPosts(user_id: number, filter?: IUserFilter,cursor?: number, showPrivate?: boolean): Promise<IPostDataResponse> {
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
        ])
        .addSelect('COUNT(DISTINCT comments.id)', 'commentCount')
        .addSelect('COUNT(DISTINCT likes.id)', 'likeCount')
        .addSelect(`EXISTS(
            SELECT 1 FROM post_likes AS likes 
            WHERE post.id = likes.post_id AND likes.user_id = :userId) AS "likedByMe"`)
            .setParameter('userId', user_id)
        .groupBy('post.id')
        .addGroupBy('user.id')
        .orderBy('post.id', 'DESC')
        .limit(loadLimit)

    if(showPrivate) {query.andWhere('post.private = :isPrivate', { isPrivate: true })}
    else {query.andWhere('post.private = :isPrivate', { isPrivate: false })}

    if (filter?.username) { query.andWhere('user.username = :username', { username: filter.username }) }

    if (filter?.userId) { query.andWhere('user.id = :userId', { userId: filter.userId }) }

    if (cursor) {
        query.andWhere('post.id < :cursor', { cursor })
    }

    const posts = await query.getRawMany<IPostData>()
    const nextCursor = posts.length ? posts[posts.length - 1].id : null

    return { posts, nextCursor }
    }

    public async getPostById(post_id: number, user_id: number): Promise<IPostData> {
        const cacheKey = `post:${post_id}:metadata`;
        const likedByMe = await this.postsRepo.createQueryBuilder('post')
            .innerJoin('post.likes', 'likes')
            .where('post.id = :post_id', { post_id })
            .andWhere('likes.user_id = :user_id', { user_id })
            .getCount() > 0;

        const cachedPost = await this.cacheManager.get<IPostData>(cacheKey);
        if(cachedPost) return {...cachedPost, likedByMe}

        const post = await this.postsRepo.createQueryBuilder('post')
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
            .getRawOne<IPostData>();

        if (!post) throw new BadRequestException('Post not found.')

        await this.cacheManager.set(cacheKey, post, this.postsCacheTTL)

        return {...post, likedByMe};
    }

    public async removePostForce(post_id: number) {
        const result = await this.postsRepo.delete({ id: post_id });
        if (!result.affected) {
            throw new BadRequestException('Post not found.');
        }

        return { message: 'Post force deleted successfully.'  };
    }

}
