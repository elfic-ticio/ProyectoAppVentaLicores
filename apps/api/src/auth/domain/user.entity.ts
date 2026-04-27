import { Role } from '@merma/db';

/**
 * Pure domain entity — no Prisma types, no decorators.
 * Represents the core User concept in the auth bounded context.
 */
export interface UserEntity {
  id: string;
  email: string;
  role: Role;
  mfaEnabled: boolean;
  kycStatus: string;
  createdAt: Date;
}
