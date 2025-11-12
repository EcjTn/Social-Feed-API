import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtAsyncOption } from 'src/configs/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtPassportStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RecaptchaModule } from 'src/recaptcha/recaptcha.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtAsyncOption),
    TypeOrmModule.forFeature([RefreshToken]),
    RecaptchaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtPassportStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard]
})
export class AuthModule {}
