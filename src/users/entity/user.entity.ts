import { UserRole } from "src/common/enums/user-role.enum";
import { Follow } from "src/follow/entity/follows.entity";
import { PostLikes } from "src/likes/entities/post-likes.entity";
import { Posts } from "src/posts/entity/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class Users {

    @PrimaryGeneratedColumn()
    id: number

    @Column( {unique: true, type: 'varchar'} )
    username: string

    @Column( {
        type: 'enum',
        enum: UserRole,
        default: UserRole.User
    } )
    role: UserRole

    @Column()
    age: number

    @Column()
    password: string

    @Column( {default: false} )
    is_banned: boolean

    @Column({nullable: true, type: 'text'})
    bio?: string

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @OneToMany(() => Posts, posts => posts.user)
    posts: Posts[]

    @OneToMany(() => Follow, follow => follow.follower)
    followers: Follow[]

}