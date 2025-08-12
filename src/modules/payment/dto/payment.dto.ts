import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'Order ID for payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Payment amount in cents',
    example: 2500,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Additional payment metadata',
    required: false,
    example: { customerEmail: 'user@example.com' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class PaymentWebhookDto {
  @ApiProperty({
    description: 'Payment provider webhook payload',
  })
  @IsObject()
  payload: Record<string, any>;

  @ApiProperty({
    description: 'Webhook signature for verification',
    required: false,
  })
  @IsOptional()
  @IsString()
  signature?: string;
}

export class PaymentMethodDto {
  @ApiProperty({
    description: 'Payment method identifier',
    example: 'pm_1234567890',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Payment method type',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsEnum(PaymentMethod)
  type: PaymentMethod;

  @ApiProperty({
    description: 'Payment method details',
    example: { last4: '4242', brand: 'visa' },
  })
  @IsObject()
  details: Record<string, any>;

  @ApiProperty({
    description: 'Whether this is the default payment method',
    example: false,
  })
  @IsOptional()
  isDefault?: boolean;
}
