import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity'; // تأكد من مسار الـ User Entity الخاص بك
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// ─── تحديد نوع الـ SafeUser المرجوع بدون باسوورد ─────────────────────────────
type SafeUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // حقن الـ Repository بدلاً من Prisma
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  /** تفكيك الباسوورد وإرجاع الكائن آمن */
  private omitPassword<T extends { password?: unknown }>(
    user: T,
  ): Omit<T, 'password'> {
    const { password: _, ...safe } = user;
    return safe;
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

    try {
      // إنشاء كائن المستخدم الجديد وربطه بالـ tenantId
      const newUser = this.userRepository.create({
        ...createAuthDto,
        password: hashedPassword,
        tenantId: tenantId, // ربط مباشر عبر الـ ID
      });

      const user = await this.userRepository.save(newUser);
      return this.omitPassword(user);
    } catch (err) {
      // كود خطأ التكرار (Unique Constraint) في PostgreSQL مع TypeORM هو '23505'
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
    // جلب جميع الحقول ما عدا الباسوورد للـ Security باستخدام الـ Query Builder أو الـ select
    const users = await this.userRepository.find({
      select: ['id', 'username', 'email', 'tenantId', 'createdAt', 'updatedAt'], // حدد الحقول الآمنة فقط
    });
    return users;
  }

  // ─── FIND ONE ────────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'tenantId', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  // ─── FIND BY EMAIL (داخلي - يجلب الباسوورد للمقارنة) ──────────────────────────
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

    // التعامل مع تغيير الـ Tenant إن وُجد كـ string ID مباشر
    if (updateData.tenant && typeof updateData.tenant === 'string') {
      updateData.tenantId = updateData.tenant;
      delete updateData.tenant;
    }

    try {
      // تحديث البيانات في الـ Repository وحفظها
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