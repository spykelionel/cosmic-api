import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'Spyke Lionel' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'This project has made a great impact in my life.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
