import { Users } from "src/users/entity/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Posts } from "src/posts/entity/post.entity"

@Entity('post_likes')
@Unique(['user', 'post'])
export class PostLikes {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Posts, post => post.likes, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'post_id'})
    post: Posts

    @ManyToOne(() => Users, { onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: Users

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}