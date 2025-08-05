import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt.auth.guard';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqService } from './faq.service';

@ApiTags('Faq')
@Controller('faq')
@ApiBearerAuth()
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'The FAQ entry has been successfully created.',
    schema: {
      example: {
        id: '60a79c9b9b1d9b5f5f5e8c8e',
        question: 'What is the meaning of life?',
        answer: 'Life is a journey of experiences and growth.',
        createdAt: '2024-07-23T00:00:00.000Z',
        updatedAt: '2024-07-23T00:00:00.000Z',
      },
    },
  })
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all FAQ entries.',
    schema: {
      example: [
        {
          id: '60a79c9b9b1d9b5f5f5e8c8e',
          question: 'What is the meaning of life?',
          answer: 'Life is a journey of experiences and growth.',
          createdAt: '2024-07-23T00:00:00.000Z',
          updatedAt: '2024-07-23T00:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.faqService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns a single FAQ entry by ID.',
    schema: {
      example: {
        id: '60a79c9b9b1d9b5f5f5e8c8e',
        question: 'What is the meaning of life?',
        answer: 'Life is a journey of experiences and growth.',
        createdAt: '2024-07-23T00:00:00.000Z',
        updatedAt: '2024-07-23T00:00:00.000Z',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The FAQ entry has been successfully updated.',
    schema: {
      example: {
        id: '60a79c9b9b1d9b5f5f5e8c8e',
        question: 'What is the meaning of life?',
        answer: 'Life is a journey of experiences and growth.',
        createdAt: '2024-07-23T00:00:00.000Z',
        updatedAt: '2024-07-23T00:00:00.000Z',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The FAQ entry has been successfully deleted.',
    schema: {
      example: {
        message: 'FAQ entry successfully deleted',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
