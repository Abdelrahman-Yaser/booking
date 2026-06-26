import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().uri().required().messages({
    'string.uri': 'DATABASE_URL must be a valid PostgreSQL connection string',
    'any.required': 'DATABASE_URL is required',
  }),

  JWT_SECRET: Joi.string().min(16).required().messages({
    'string.min': 'JWT_SECRET must be at least 16 characters for security',
    'any.required': 'JWT_SECRET is required',
  }),

  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // ─── Mail ───────────────────────────────────────────────────────
  MAIL_PROVIDER: Joi.string().valid('smtp', 'sendgrid').default('smtp'),
  MAIL_HOST: Joi.string().default('smtp.mailtrap.io'),
  MAIL_PORT: Joi.number().default(587),
  MAIL_SECURE: Joi.boolean().default(false),
  MAIL_USER: Joi.string().optional(),
  MAIL_PASS: Joi.string().optional(),
  MAIL_FROM: Joi.string().email().default('noreply@booking.com'),
  MAIL_FROM_NAME: Joi.string().default('Booking Platform'),

  // 👇 تعديل سحري: هيكون إجباري فقط في حالة اختيار sendgrid كـ Provider 👇
  SENDGRID_API_KEY: Joi.string().when('MAIL_PROVIDER', {
    is: 'sendgrid',
    then: Joi.required().messages({
      'any.required': 'SENDGRID_API_KEY is required when MAIL_PROVIDER is set to sendgrid',
    }),
    otherwise: Joi.optional(),
  }),
});