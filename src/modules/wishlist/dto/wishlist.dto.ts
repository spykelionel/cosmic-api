import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({
    description: 'Product ID to add to wishlist',
    example: '123e456702d249j24a',
  })
  @IsNotEmpty()
  @IsString()
  productId: string;
}
