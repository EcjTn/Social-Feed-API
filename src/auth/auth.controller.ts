import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import type { Request, Response } from 'express';
import { RegisterUserDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async registerUser(@Body() data: RegisterUserDto) {
    return await this.authService.registerUser(data.username, data.password, data.age, data.recaptchaToken)
  }

  @Post('/login')
  public async loginUser(@Body() data: LoginUserDto, @Res({passthrough: true}) res: Response) {
    return await this.authService.loginUser(data.username, data.password, res)
  }

  @Post('/refresh')
  public async refresh(@Req() req: Request ,@Res({passthrough: true}) res: Response){
    return await this.authService.refreshToken(req, res)
  }

}
