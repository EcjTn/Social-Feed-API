import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto'
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { IJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { COOKIE_KEYS } from './constants/cookie.constant';
import { RecaptchaService } from 'src/recaptcha/recaptcha.service';
import { cookieOptions } from 'src/config/cookie-options.config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(RefreshToken) readonly refreshRepo: Repository<RefreshToken>,
        private readonly recaptchaService: RecaptchaService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    public async registerUser(username: string, password: string, age: number, recaptchaToken: string) {

        const validateRecaptchaToken = await this.recaptchaService.validateToken(recaptchaToken)
        if (!validateRecaptchaToken) throw new UnauthorizedException('Invalid Recaptcha Token!')

        const isUserTaken = await this.usersService.findByUser(username)
        if (isUserTaken) throw new ConflictException()

        //I might make a password service for this soon - to separate.
        const saltRound = 10
        const hashPassword = await bcrypt.hash(password, saltRound)

        try {
            await this.usersService.add(username, hashPassword, age);
            return { message: 'Successfully Registered' };
        } catch (err) {
            console.error(err); // ?.message
            throw new InternalServerErrorException('Failed to create user');
        }

    }

    public async loginUser(username: string, password: string, recaptchaToken: string, res: Response) {

        const validateRecaptchaToken = await this.recaptchaService.validateToken(recaptchaToken)
        if (!validateRecaptchaToken) throw new UnauthorizedException('Invalid Recaptcha Token!')

        const existingUser = await this.usersService.findByUser(username, { checkBanned: true })
        if (!existingUser) throw new UnauthorizedException("Invalid credentials!")

        const passwordMatch = await bcrypt.compare(password, existingUser.password)
        if (!passwordMatch) throw new UnauthorizedException("Invalid credentials!")

        const payload: IJwtPayload = {
            sub: existingUser.id,
            role: existingUser.role
        }

        //give both jwt and rt Tokens
        const accessToken = await this.jwtService.signAsync(payload)
        const refreshToken = crypto.randomBytes(64).toString('hex')
        const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex')

        const newRefreshToken = this.refreshRepo.create({
            hash_token: hashedRefreshToken,
            user: existingUser,
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)//7 days
        })
        await this.refreshRepo.save(newRefreshToken)

        res.cookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, cookieOptions)

        return { accessToken }
    }


    public async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies[COOKIE_KEYS.REFRESH_TOKEN]
        if (!refreshToken) throw new UnauthorizedException()


        //Check Current RT existence
        const hashPlainToken = crypto.createHash('sha256').update(refreshToken).digest('hex')
        const tokenRecord = await this.refreshRepo.findOne({ where: { hash_token: hashPlainToken }, relations: ['user'] })
        if (!tokenRecord) throw new UnauthorizedException()


        const currentDate = new Date()
        if (tokenRecord.expires_at < currentDate) {
            await this.refreshRepo.delete({ id: tokenRecord.id })
            throw new ForbiddenException('Expired.')
        }

        const user = tokenRecord.user
        const payload: IJwtPayload = {
            sub: user.id,
            role: user.role
        }
        const newAccessToken = await this.jwtService.signAsync(payload)

        const newPlainRefreshToken = crypto.randomBytes(64).toString('hex')
        const newHashedRefreshToken = crypto.createHash('sha256').update(newPlainRefreshToken).digest('hex')

        await this.refreshRepo.update({
            id: tokenRecord.id
        }, {
            hash_token: newHashedRefreshToken,
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)//7 days
        })


        console.log(`Refresh Token rotated for ${user.username}`)

        res.cookie(COOKIE_KEYS.REFRESH_TOKEN, newPlainRefreshToken, cookieOptions)

        return { newAccessToken }
    }


}
