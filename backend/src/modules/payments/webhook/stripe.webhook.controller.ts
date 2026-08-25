import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { StripeWebhookService } from './stripe.webhook.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly webhookService: StripeWebhookService) {}

  // POST /webhooks/stripe
  // ⚠️  This route must receive RAW body — configure in main.ts:
  //     app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));
  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint() // hide from Swagger — not for human clients
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ): Promise<{ received: boolean }> {
    // ✅ rawBody is attached by express.raw() middleware in main.ts
    const rawBody = (req as unknown as { rawBody: Buffer }).rawBody;

    if (!rawBody) {
      this.logger.error('rawBody is missing — check main.ts middleware setup');
      return { received: false };
    }

    await this.webhookService.handleWebhook(rawBody, sig);
    return { received: true };
  }
}
