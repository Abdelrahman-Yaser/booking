/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

  // POST /auth/register
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto, createAuthDto.tenant);
  }

  // POST /auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK) // override default 201 → 200 for login
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ─── PROTECTED ROUTES (require valid JWT) ────────────────────────────────────

  // GET /auth/me  →  returns the currently logged-in user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: ExpressRequest & { user: any }) {
    return req.user; // injected by JwtStrategy after token validation
  }

  // GET /auth/users  →  list all users (admin only in real app)
  @UseGuards(JwtAuthGuard)
  @Get('users')
  findAll() {
    return this.authService.findAll();
  }

  // GET /auth/users/:id
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id); // ← string, no +id conversion
  }

  // PATCH /auth/users/:id
  @UseGuards(JwtAuthGuard)
  @Patch('users/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto); // ← string
  }

  // DELETE /auth/users/:id
  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id); // ← string
  }
}
