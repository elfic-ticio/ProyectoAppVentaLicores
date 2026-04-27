import { SetMetadata } from '@nestjs/common';
import { Role } from '@merma/db';

export const ROLES_KEY = 'roles';

/**
 * Marks a route as requiring one or more roles.
 * Used together with RolesGuard.
 * Example: @Roles(Role.ADMIN, Role.MODERATOR)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
