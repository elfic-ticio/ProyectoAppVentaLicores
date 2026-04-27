import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService, AuthTokens } from './application/auth.service';
import { RegisterDtoSchema, RegisterDto } from './application/dto/register.dto';
import { LoginDtoSchema, LoginDto } from './application/dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtPayload } from './infrastructure/jwt.strategy';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/v1/auth/register
   * Creates a new BUYER account. Public route.
   */
  @Public()
  @Post('register')
  async register(@Body() body: unknown): Promise<AuthTokens> {
    const result = RegisterDtoSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.flatten().fieldErrors);
    }
    const dto: RegisterDto = result.data;
    return this.authService.register(dto);
  }

  /**
   * POST /api/v1/auth/login
   * Returns a signed JWT access_token. Public route.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: unknown): Promise<AuthTokens> {
    const result = LoginDtoSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.flatten().fieldErrors);
    }
    const dto: LoginDto = result.data;
    return this.authService.login(dto);
  }

  /**
   * GET /api/v1/auth/me
   * Returns the profile of the authenticated user. Requires valid JWT.
   */
  @Get('me')
  me(@Req() req: RequestWithUser): JwtPayload {
    return req.user;
  }
}
