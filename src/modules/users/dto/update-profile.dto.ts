import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'The occupation of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({
    example: 'United States',
    description: 'The country of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: ['@johndoe', '@johndoe_dev'],
    description: 'Array of social media handles',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  socialMediaHandles?: string[];

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'The avatar URL of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;
} 