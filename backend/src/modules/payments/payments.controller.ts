import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

// ─── extend Express Request with our JWT payload ─────────────────────────────
interface AuthRequest extends ExpressRequest {
  user: { id: string; email: string; role: string; tenantId: string };
}

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // POST /payments — initiate payment for a booking
  @Post()
  @ApiOperation({ summary: 'Initiate a payment for a booking' })
  initiatePayment(
    @Body() dto: CreatePaymentDto,
    @Request() req: AuthRequest,
  ) {
    return this.paymentsService.initiatePayment(dto);
  }

  // GET /payments — list all payments for this tenant
  @Get()
  @ApiOperation({ summary: 'List all payments for the tenant' })
  findAll(@Request() req: AuthRequest) {
    return this.paymentsService.findAll(req.user.tenantId);
  }

  // GET /payments/revenue — revenue summary
  @Get('revenue')
  @ApiOperation({ summary: 'Get total revenue for the tenant' })
  getRevenue(@Request() req: AuthRequest) {
    return this.paymentsService.getRevenue(req.user.tenantId);
  }

  // GET /payments/:id — single payment
  @Get(':id')
  @ApiOperation({ summary: 'Get a single payment by ID' })
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.paymentsService.findOne(id, req.user.tenantId);
  }

  // PATCH /payments/:id/refund — issue refund
  @Post(':id/refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refund a payment' })
  refund(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.paymentsService.refund(id, req.user.tenantId);
  }
}
