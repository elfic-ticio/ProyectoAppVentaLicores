import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@merma/db';
import { ROLES_KEY } from '../decorators/roles.decorator';

export interface RequestWithUser extends Request {
  user: { sub: string; email: string; role: Role };
}

/**
 * RBAC guard — checks that the authenticated user has one of the required roles.
 * Must be used AFTER JwtAuthGuard (which populates request.user).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { role } = request.user;

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
