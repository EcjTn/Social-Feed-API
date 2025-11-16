import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Comments } from './entity/comments.entity';
import { Repository } from 'typeorm';
import { RecaptchaService } from 'src/recaptcha/recaptcha.service';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments) private readonly commentRepo: Repository<Comments>,
        private readonly usersService: UsersService
    ) { }

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
