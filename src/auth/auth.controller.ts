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
  public registerUser(@Body() data: RegisterUserDto) {
    return this.authService.registerUser(data.username, data.password, data.age, data.recaptchaToken)
  }

  @Post('/login')
  public loginUser(@Body() data: LoginUserDto, @Res({passthrough: true}) res: Response) {
    return this.authService.loginUser(data.username, data.password, data.recaptchaToken, res)
  }

  @Post('/refresh')
  public refresh(@Req() req: Request ,@Res({passthrough: true}) res: Response){
    return this.authService.refreshToken(req, res)
  }

}
