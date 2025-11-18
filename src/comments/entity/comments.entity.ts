import { Posts } from "src/posts/entity/post.entity";
import { Users } from "src/users/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('comments')
export class Comments {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: Users

    @ManyToOne(() => Posts, post => post.comments,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'post_id'})
    post: Posts

    @ManyToOne(() => Comments, {onDelete: 'CASCADE', nullable: true})
    @JoinColumn({name: 'parent_id'})
    parent: Comments

    @Column()
    content: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date

}