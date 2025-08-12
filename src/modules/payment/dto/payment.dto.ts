import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  PROCESSING = 'PROCESSING',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
  CASH = 'cash',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// Stripe-specific DTOs
export class CreatePaymentIntentDto {
  @ApiProperty({ description: 'Order ID for the payment' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'Payment method type', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Currency code (e.g., USD, EUR)',
    default: 'USD',
  })
  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @ApiProperty({ description: 'Additional metadata for the payment' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ConfirmPaymentDto {
  @ApiProperty({ description: 'Payment intent ID from Stripe' })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @ApiProperty({ description: 'Order ID' })
  @IsString()
  @IsNotEmpty()
  orderId: string;
}

export class CreateRefundDto {
  @ApiProperty({ description: 'Payment intent ID from Stripe' })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @ApiProperty({ description: 'Order ID' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'Refund amount in cents', required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ description: 'Reason for refund' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class PaymentMethodDto {
  @ApiProperty({ description: 'Payment method ID from Stripe' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Payment method type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Card details if applicable' })
  @IsObject()
  @IsOptional()
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };

  @ApiProperty({ description: 'Billing details' })
  @IsObject()
  @IsOptional()
  billingDetails?: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}

export class PaymentIntentDto {
  @ApiProperty({ description: 'Payment intent ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Amount in cents' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus;

  @ApiProperty({ description: 'Payment method used' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ description: 'Client secret for frontend confirmation' })
  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @ApiProperty({ description: 'Metadata associated with the payment' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class WebhookEventDto {
  @ApiProperty({ description: 'Stripe webhook event ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Event type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Event data' })
  @IsObject()
  @IsNotEmpty()
  data: {
    object: any;
  };

  @ApiProperty({ description: 'Event timestamp' })
  @IsString()
  @IsNotEmpty()
  created: string;
}
