import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 15 Pro',
    description: 'The name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Latest iPhone with advanced features',
    description: 'The description of the product',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'The price of the product',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 899.99,
    description: 'The sale price of the product (optional)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Array of product image URLs',
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    example: 100,
    description: 'The stock quantity of the product',
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'IPHONE15PRO001',
    description: 'The SKU of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    example: 0.5,
    description: 'The weight of the product in kg',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({
    example: '15.5 x 7.8 x 0.8 cm',
    description: 'The dimensions of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the product is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the product is featured',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the product is on sale',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isOnSale?: boolean;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the product category',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
} 