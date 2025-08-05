import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({
    example: 'Life care',
    description: 'The question to be included in the FAQ',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    example: "What's life without care if we can't stand and stare.",
    description: 'The answer to the FAQ question',
  })
  @IsString()
  @IsNotEmpty()
  answer?: string;
}
