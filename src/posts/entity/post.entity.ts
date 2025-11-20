import { Comments } from "src/comments/entity/comments.entity";
import { PostLikes } from "src/likes/entities/post-likes.entity";
import { Users } from "src/users/entity/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
;

@Entity('posts')
export class Posts {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, users => users.posts ,{ onDelete: 'CASCADE' })
    @JoinColumn({name: 'user_id'})
    @Index()
    user: Users

    @Column()
    title: string

    @Column()
    content: string

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date

    @OneToMany(() => PostLikes, likes => likes.post)
    likes: PostLikes[]

    @OneToMany(() => Comments, comment => comment.post)
    comments: Comments[]

}