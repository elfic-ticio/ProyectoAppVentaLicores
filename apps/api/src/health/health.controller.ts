import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

interface HealthResponse {
  status: 'ok' | 'degraded';
  uptime: number;
  db: 'ok' | 'error';
  timestamp: string;
}

/**
 * GET /api/v1/health
 * Returns the health status of the API and database connectivity.
 * @Public() — no auth required, used by load balancers and monitoring tools.
 */
@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async check(): Promise<HealthResponse> {
    let dbStatus: 'ok' | 'error' = 'ok';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    return {
      status: dbStatus === 'ok' ? 'ok' : 'degraded',
      uptime: Math.floor(process.uptime()),
      db: dbStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
