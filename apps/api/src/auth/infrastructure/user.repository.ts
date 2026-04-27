import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../domain/user.entity';
import { Role } from '@merma/db';

/**
 * Infrastructure adapter — translates Prisma User ↔ UserEntity.
 * AuthService depends only on this abstraction, not on PrismaService directly.
 */
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<(UserEntity & { passwordHash: string }) | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      mfaEnabled: user.mfa_enabled,
      kycStatus: user.kyc_status,
      createdAt: user.created_at,
      passwordHash: (user as unknown as { password_hash: string }).password_hash ?? '',
    };
  }

  async create(data: {
    email: string;
    passwordHash: string;
    phone?: string;
  }): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        // password_hash is not yet in the Prisma schema — will be added in next migration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(data.passwordHash && { password_hash: data.passwordHash } as any),
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      mfaEnabled: user.mfa_enabled,
      kycStatus: user.kyc_status,
      createdAt: user.created_at,
    };
  }
}
