import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Comments } from './entity/comments.entity';
import { Repository } from 'typeorm';
import { Comment, CommentsResponse } from './interfaces/comments-data.interface';

@Injectable()
export class CommentsService {
    private readonly commentsLimitLoad = 10;
    constructor(
        @InjectRepository(Comments) private readonly commentRepo: Repository<Comments>,
        private readonly usersService: UsersService
    ) { }

    //TOP COMMENTS ONLY
    public async getCommentsByPostId(post_id: number, cursor?: number): Promise<CommentsResponse> {
        const query = this.commentRepo.createQueryBuilder('comment')
            .innerJoin('comment.user', 'user')
            .leftJoin('comment.post', 'post')
            .leftJoin('comments', 'replies', 'replies.parent_id = comment.id')
            .select([
                'user.username AS username',
                'comment.id AS id',
                'comment.content AS content',
                'comment.created_at AS createdAt'
            ])
            .addSelect('COUNT(replies.id)', 'repliesCount')
            .where('post.id = :post_id', { post_id })
            .andWhere('comment.parent_id IS NULL')
            .limit(this.commentsLimitLoad)
            .groupBy('user.username')
            .addGroupBy('comment.id')
            .orderBy('comment.id', 'DESC') // NEWEST TO OLDEST

        if (cursor) {
            query.andWhere('comment.id < :cursor', { cursor })
        }

        try {
            const comments = await query.getRawMany<Comment>()
            const nextCursor = comments.length ? comments[comments.length - 1].id : null

            return { comments, nextCursor }
        }
        catch (e) {
            console.log("COMMENTS GET POST ERROR: ", e)
            //throw new InternalServerErrorException('Failed to load comments.')
            return { comments: [], nextCursor: null }
        }

    }

    public async getRepliesByParentId(parent_id: number, cursor?: number): Promise<CommentsResponse> {
        const query = this.commentRepo.createQueryBuilder('comment')
            .innerJoin('comment.user', 'user')
            .leftJoin('comments', 'replies', 'replies.parent_id = comment.id')
            .select([
                'user.username AS username',
                'comment.id AS id',
                'comment.content AS content',
                'comment.created_at AS createdAt'
            ])
            .addSelect('COUNT(replies.id)', 'repliesCount')
            .where('comment.parent_id = :parent_id', { parent_id })
            .limit(this.commentsLimitLoad)
            .groupBy('user.username')
            .addGroupBy('comment.id')
            .orderBy('comment.id', 'ASC') // OLDEST TO NEWEST;

        if (cursor) {
            query.andWhere('comment.id > :cursor', { cursor });
        }

        try {
            const comments = await query.getRawMany<Comment>();
            const nextCursor = comments.length ? comments[comments.length -1].id : null

            return { comments, nextCursor };
        } catch (e) {
            console.log("REPLIES GET ERROR: ", e);
            return { comments: [], nextCursor: null };
        }
    }

    public async add(user_id: number, post_id: number, content: string) {
        const userRecord = await this.usersService.findById(user_id)
        if (userRecord) throw new BadRequestException('User not found')

        try {
            const newComment = this.commentRepo.create({
                user: { id: user_id },
                post: { id: post_id },
                content
            })

            await this.commentRepo.save(newComment)
            return { message: 'Successfully commented!' }
        }
        catch (e) {
            //FK violation on POSTS or other db errors
            console.log("COMMENT ADD ERROR: ", e)
            throw new InternalServerErrorException('Failed to add comment')
        }

    }

    public async addReply(
        user_id: number,
        parent_comment_id: number,
        content: string,
    ) {
        const userRecord = await this.usersService.findById(user_id);
        if (!userRecord) throw new BadRequestException('User not found');

        const parentComment = await this.commentRepo.findOne({ where: { id: parent_comment_id } });
        if (!parentComment) throw new BadRequestException('Parent comment not found');

        try {
            const newReply = this.commentRepo.create({
                user: { id: user_id },
                post: { id: parentComment.post.id },
                parent: { id: parent_comment_id },
                content
            });

            await this.commentRepo.save(newReply);

            return { message: 'Successfully replied!' };
        } catch (e) {
            // FK violation
            console.log("REPLY ADD ERROR: ", e);
            throw new InternalServerErrorException('Failed to add reply.');
        }
    }

    public async delete(user_id: number, comment_id: number) {
        try {
            const result = await this.commentRepo.delete({
                id: comment_id,
                user: { id: user_id },
            });

            if (!result.affected) throw new BadRequestException('You did not make this comment.')

            return { message: 'Comment deleted successfully.' };
        } catch (e) {
            console.log("COMMENT DELETE ERROR: ", e)
            throw new InternalServerErrorException('Failed to delete comment.');
        }
    }

}
