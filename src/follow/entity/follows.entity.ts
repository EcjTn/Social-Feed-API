import { Users } from "src/users/entity/user.entity";
import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('follows')
@Unique(['follower', 'following'])
export class Follow {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'follower_id'})
    follower: Users

    @ManyToOne(() => Users, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'following_id'})
    @Index()
    following: Users

}