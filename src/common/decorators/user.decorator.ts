import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

export const User = createParamDecorator((data: unknown, context: ExecutionContext): IJwtPayload => {
    const req = context.switchToHttp().getRequest()
    return req.user as IJwtPayload
})