import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) readonly usersRepo: Repository<Users>
    ){}

    //for finding user's existense
    public findById(id: number) {
        return this.usersRepo.findOne({ where: {id}, select: ['id'] })
    }

    //Used for auths -- check bans
    public findByUser(username: string, options?: {checkBanned: boolean}) {
        const where: any = { username }
        if(options?.checkBanned) { where.is_banned = false } 

        return this.usersRepo.findOne({ where })
    }

    public add(username: string, password: string, age: number) {
        const newUser = this.usersRepo.create({username, password, age})
        return this.usersRepo.save(newUser)
    }

    //only used for public purposes.
    public async getPublicProfile(username: string) {
        const userRecord = await this.usersRepo.findOne({
            select: ['id' ,'username' , 'role', 'is_banned', 'bio', 'created_at'],
            relations: ['posts'],
            where: { username }
        })
        if(!userRecord) throw new NotFoundException("User not found.")

        return userRecord
    }

    //for /users/me
    public async getOwnProfile(id: number) {
        const userRecord = await this.usersRepo.findOne({
            where: {id},
            select: ['id', 'username', 'bio', 'role', 'created_at'],
            relations: ['posts']
        })
        if(!userRecord) throw new NotFoundException()

        return userRecord
    }

    public async updateBio(id: number, bio: string) {
        const userRecord = await this.usersRepo.findOne({where: {id: id}, select: ['bio'] })

        if(!userRecord) throw new NotFoundException()
        
        userRecord.bio = bio
        await this.usersRepo.save(userRecord)

        return { message: 'Bio updated!' }
    }

    public async changePassword(id: number, password: string) {
        const userRecord = await this.usersRepo.findOne({where: {id}, select: ['password']})
        if(!userRecord) throw new NotFoundException()

        const saltRound = 10
        userRecord.password = await bcrypt.hash(password, saltRound)

        await this.usersRepo.save(userRecord)
        
        return {message: 'Successfully changed password.'}
    }


}
