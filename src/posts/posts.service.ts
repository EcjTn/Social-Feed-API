import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entity/post.entity';
import { UsersService } from 'src/users/users.service';
import { UserPost, UserPostsResponse } from './interfaces/user-posts.interface';
import { PublicPost, PublicPostsResponse } from './interfaces/public-posts.interface';
import { verifyRecaptcha } from 'src/utils/recaptcha.util';
import { PostFilter } from './interfaces/post-filter.interface';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) private readonly postsRepo: Repository<Posts>,
        private readonly usersService: UsersService,
    ) { }

    public async add(user_id: number, title: string, content: string) {
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

    public async getPosts(filter?: PostFilter, cursor?: number) {
    const loadLimit = 5
    const query = this.postsRepo.createQueryBuilder('post')
        .leftJoin('post.comments', 'comments')
        .innerJoin('post.user', 'user')
        .leftJoin('post.likes', 'likes')
        .select([
            'post.id AS id',
            'post.title AS title',
            'post.content AS content',
            'post.created_at AS created_at',
        ])
        .addSelect('COUNT(DISTINCT comments.id)', 'commentCount')
        .addSelect('COUNT(DISTINCT likes.id)', 'likeCount')
        .groupBy('post.id')
        .addGroupBy('user.username')
        .orderBy('post.id', 'DESC')
        .limit(loadLimit)

    if (filter?.username) {
        query.andWhere('user.username = :username', { username: filter.username })
    } else if (filter?.userId) {
        query.andWhere('user.id = :userId', { userId: filter.userId })
    } else {
        query.addSelect('user.username AS username')
    }

    if (cursor) {
        query.andWhere('post.id < :cursor', { cursor })
    }

    const posts = await query.getRawMany<PublicPost | UserPost>()
    const nextCursor = posts.length ? posts[posts.length - 1].id : null

    return { posts, nextCursor }
}

}
