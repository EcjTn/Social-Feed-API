import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from 'src/users/entity/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    hash_token: string

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'user_id'})
    user: Users

    @Column({type: 'timestamptz'})
    expires_at: Date

}