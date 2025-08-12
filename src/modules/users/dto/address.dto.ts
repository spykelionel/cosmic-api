import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: 'SHIPPING',
    description: 'The type of address (SHIPPING, BILLING, or BOTH)',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

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
    example: false,
    description: 'Whether this is the default address',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @ApiProperty({
    example: 'John',
    description: 'First name for the address',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name for the address',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: 'Acme Corp',
    description: 'Company name',
    required: false,
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Address line 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'Address line 2',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({
    example: 'New York',
    description: 'City',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'NY',
    description: 'State/Province',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    example: '10001',
    description: 'Postal code',
    required: false,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({
    example: 'USA',
    description: 'Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: true,
    description: 'Whether this is the default address',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
} 