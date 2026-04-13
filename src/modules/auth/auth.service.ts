/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

// ─── type: user row without password ─────────────────────────────────────────
type SafeUser = Omit<
  Awaited<ReturnType<PrismaService['user']['findUniqueOrThrow']>>,
  'password'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  /** Strip password — returns a new object, never mutates the original */
  private omitPassword<T extends { password?: unknown }>(
    user: T,
  ): Omit<T, 'password'> {
    const { password: _, ...safe } = user;
    return safe;
  }

  /** Sign both access + refresh tokens in one place */
  private async signTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '15m', // short-lived
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d', // long-lived
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // ─── REGISTER ────────────────────────────────────────────────────────────────
  // auth.service.ts
  async create(
    createAuthDto: CreateAuthDto,
    tenantId: string,
  ): Promise<SafeUser> {
    const existing = await this.prisma.user.findUnique({
      where: { email: createAuthDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...createAuthDto,
          password: hashedPassword,
          tenant: {
            connect: { id: tenantId },
          },
        },
      });

      return this.omitPassword(user);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        (err as Prisma.PrismaClientKnownRequestError).code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException('Could not create user');
    }
  }

  // ─── LOGIN ───────────────────────────────────────────────────────────────────
  async login(loginDto: LoginDto) {
    // 1. load user WITH password
    const user = await this.findByEmail(loginDto.email);

    // use same generic message for both cases — don't leak which field is wrong
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. compare passwords
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. sign tokens
    const tokens = await this.signTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: this.omitPassword(user),
    };
  }

  // ─── REFRESH TOKEN ───────────────────────────────────────────────────────────
  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        role: string;
      }>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      // confirm user still exists
      const user = await this.findOne(payload.sub);

      // Use fresh user data for token generation
      const tokens = await this.signTokens(user.id, user.email, user.role);

      return tokens;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  // ─── FIND ALL ────────────────────────────────────────────────────────────────
  async findAll(): Promise<SafeUser[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const users = await this.prisma.user.findMany({
      omit: { password: true }, // Prisma 5.13+ built-in omit
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return users;
  }

  // ─── FIND ONE ────────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  // ─── FIND BY EMAIL  (internal — includes password for bcrypt.compare) ────────
  async findByEmail(email: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.user.findUnique({ where: { email } });
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────
  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<SafeUser> {
    await this.findOne(id); // 404 if missing

    // build a clean update payload — do NOT mutate the incoming DTO
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: any = { ...updateAuthDto };
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      // Transform tenant string to Prisma nested input format
      if (data.tenant && typeof data.tenant === 'string') {
        data.tenant = { connect: { id: data.tenant } };
      }
    } catch (err) {
      if ((err as { code?: string }).code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException('Could not update user');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    if (!updated) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.omitPassword(updated);
  }

  // ─── REMOVE ──────────────────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id); // 404 if missing

    await this.prisma.user.delete({ where: { id } });

    return { message: `User #${id} deleted successfully` };
  }
}
