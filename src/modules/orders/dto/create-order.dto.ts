import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the product',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product',
  })
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'SHIPPING',
    description: 'The type of address (SHIPPING, BILLING, or BOTH)',
  })
  @IsString()
  @IsNotEmpty()
  addressType: string;

  @ApiProperty({
    example: 'John',
    description: 'First name for the address',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name for the address',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'Acme Corp',
    description: 'Company name (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Address line 1',
  })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'Address line 2 (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({
    example: 'New York',
    description: 'City',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'NY',
    description: 'State/Province',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    example: '10001',
    description: 'Postal code',
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    example: 'USA',
    description: 'Country',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'Please deliver during business hours',
    description: 'Order notes (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: 'credit_card',
    description: 'Payment method',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
} 