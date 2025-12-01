import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;

    const requiredRoles = this.reflector.get<string[]>('role', context.getHandler());

    if(!requiredRoles.includes(user.role)) {return false;}

    return requiredRoles.includes(user.role);

  }

}
