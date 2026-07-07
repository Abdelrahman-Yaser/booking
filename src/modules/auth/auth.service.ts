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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity'; 
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  /** تفكيك الباسوورد وإرجاع الكائن آمن مع عمل Cast صريح لنوع المخرج */
  private omitPassword(user: User): SafeUser {
    const { password, ...safeUser } = user;
    return safeUser as SafeUser;
  }

  /** توقيع الـ Access والـ Refresh Tokens */
  private async signTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // ─── REGISTER ────────────────────────────────────────────────────────────────
  async create(
    createAuthDto: CreateAuthDto,
    tenantId: string,
  ): Promise<SafeUser> {
    const existing = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    // 👇 تفكيك الحقول الزائدة القادمة من الـ DTO مثل tenant أو name لتفادي اعتراض الـ DeepPartial
    const { tenant, name, ...cleanUserData } = createAuthDto as any;

    try {
      const newUser = this.userRepository.create({
        ...cleanUserData,
        password: hashedPassword,
        tenantId: tenantId, 
      });

      const user = await this.userRepository.save(newUser);
      return this.omitPassword(user);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException('Could not create user');
    }
  }

  // ─── LOGIN ───────────────────────────────────────────────────────────────────
  async login(loginDto: LoginDto) {
    const user = await this.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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

      const user = await this.findOne(payload.sub);
      const tokens = await this.signTokens(user.id, user.email, user.role);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ─── FIND ALL ────────────────────────────────────────────────────────────────
  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users as SafeUser[];
  }

  // ─── FIND ONE ────────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user as SafeUser;
  }

  // ─── FIND BY EMAIL (داخلي) ──────────────────────────
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────
  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<SafeUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    const updateData: any = { ...updateAuthDto };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    if (updateData.tenant && typeof updateData.tenant === 'string') {
      updateData.tenantId = updateData.tenant;
      delete updateData.tenant;
    }

    try {
      this.userRepository.merge(user, updateData);
      const updatedUser = await this.userRepository.save(user);
      
      return this.omitPassword(updatedUser);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException('Could not update user');
    }
  }

  // ─── REMOVE ──────────────────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    await this.userRepository.remove(user);
    return { message: `User #${id} deleted successfully` };
  }
}
