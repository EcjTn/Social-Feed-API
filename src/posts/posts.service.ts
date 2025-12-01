import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entity/post.entity';
import { UsersService } from 'src/users/users.service';
import { verifyRecaptcha } from 'src/auth/utils/recaptcha.util';
import { IUserFilter } from '../common/interfaces/user-filter.interface';
import { IPostData, IPostDataResponse } from './interfaces/post-data.interface';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) private readonly postsRepo: Repository<Posts>,
        private readonly usersService: UsersService,
    ) { }

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

    public async editPost(user_id: number, post_id: number, content: string) {
        const result = await this.postsRepo.update(
            { user: { id: user_id }, id: post_id },
            { content },
        );

        if (!result.affected) {
            throw new BadRequestException('Post not found or not editable');
        }

        return { message: 'Successfully edited post.' };
    }

    public async getPosts(user_id: number, filter?: IUserFilter, cursor?: number): Promise<IPostDataResponse> {
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

    if (filter?.username) { query.andWhere('user.username = :username', { username: filter.username }) }

    if (filter?.userId) { query.andWhere('user.id = :userId', { userId: filter.userId }) }

    if (cursor) {
        query.andWhere('post.id < :cursor', { cursor })
    }

    const posts = await query.getRawMany<IPostData>()
    const nextCursor = posts.length ? posts[posts.length - 1].id : null

    return { posts, nextCursor }
    }

    public async removePostForce(post_id: number) {
        const result = await this.postsRepo.delete({ id: post_id });
        if (!result.affected) {
            throw new BadRequestException('Post not found.');
        }

        return { message: 'Post force deleted successfully.'  };
    }

}
