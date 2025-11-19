import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import type { Request, Response } from 'express';
import { RegisterUserDto } from './dtos/register.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from './guards/jwt.guard';

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

  @Delete('/logout')
  @UseGuards(JwtAuthGuard)
  public async logoutUser(@User() user: IJwtPayload) {
    return await this.authService.logoutUser(user.sub)
  }

  @Post('/refresh')
  public async refresh(@Req() req: Request ,@Res({passthrough: true}) res: Response){
    return await this.authService.refreshToken(req, res)
  }

}
