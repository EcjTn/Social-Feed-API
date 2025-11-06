import { Module } from '@nestjs/common';
import { RecaptchaService } from './recaptcha.service';

@Module({
  providers: [RecaptchaService],
  exports: [RecaptchaService]
})
export class RecaptchaModule {}
