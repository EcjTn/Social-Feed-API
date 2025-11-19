import { Comments } from 'src/comments/entity/comments.entity';
import { Users } from 'src/users/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, Unique } from 'typeorm';


@Entity('comment_likes')
@Unique(['user', 'comment'])
export class CommentLikes {
@PrimaryGeneratedColumn()
id: number;


@ManyToOne(() => Users, { onDelete: 'CASCADE' })
@JoinColumn({name: 'user_id'})  
user: Users;  

@ManyToOne(() => Comments, { onDelete: 'CASCADE' })
@JoinColumn({name: 'comment_id'})  
comment: Comments;  


}
