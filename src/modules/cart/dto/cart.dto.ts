import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the product to add to cart',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product to add',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({
    example: 3,
    description: 'The new quantity for the cart item',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
} 