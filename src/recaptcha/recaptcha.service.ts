import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRecaptchaResponse } from './interfaces/recaptcha-response.interface';
import axios from 'axios';


@Injectable()
export class RecaptchaService {
    private secretKey: string;
    private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    constructor(private readonly configService: ConfigService){
        this.secretKey = configService.getOrThrow('RECAPTCHA_SECRET_KEY')
    }

    //Recaptcha V3
    public async validateToken(token: string) {
        try{
            const response = await axios.post<IRecaptchaResponse>(this.verifyUrl, null, {
                params: { secret: this.secretKey,response: token }
            })
            return response.data.success === true
        }
        catch(error){
            console.log('Recaptcha Validation Error: ', error)
            return false
        }
    }

}
