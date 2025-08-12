import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, Min, Max, Length } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Product rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Review comment',
    minLength: 10,
    maxLength: 500,
    example: 'Great product! Very satisfied with the quality and delivery.',
  })
  @IsString()
  @Length(10, 500)
  comment: string;
} 