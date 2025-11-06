import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt"
import { IJwtPayload } from "src/common/interfaces/jwt-payload.interface";

@Injectable()
export class JwtPassportStrategy extends PassportStrategy(JwtStrategy) {

    constructor(readonly configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('JWT_KEY')
        })
    }
    validate(payload: IJwtPayload) {
        return payload
    }
}