import { ConfigService } from '@nestjs/config'
import { type JwtModuleAsyncOptions } from '@nestjs/jwt'

export const jwtAsyncOption: JwtModuleAsyncOptions = {
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_KEY'),
        signOptions: { expiresIn: '15m' }
    })    
}