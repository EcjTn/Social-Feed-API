import { Users } from "src/users/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { PostLikes } from "./post-likes.entity";

@Entity('posts')
export class Posts {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, users => users.posts ,{ onDelete: 'CASCADE' })
    @JoinColumn({name: 'id'})
    user: Users

    @Column()
    title: string

    @Column()
    content: string

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date

    @OneToMany(() => PostLikes, likes => likes.post)
    likes: PostLikes[]

}