import { Users } from "src/users/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Posts } from "./post.entity";

@Entity('post_likes')
@Unique(['user', 'post'])
export class PostLikes {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Posts, post => post.likes, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'post_id'})
    post: Posts

    @ManyToOne(() => Users, user => user.liked, { onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: Users
}