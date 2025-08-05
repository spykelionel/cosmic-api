import { Injectable } from '@nestjs/common';
import { httpErrorException } from 'src/core/services/utility.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialService {
  /**
   *
   */
  constructor(private readonly prisma: PrismaService) {}
  async create(createTestimonialDto: CreateTestimonialDto) {
    try {
      const { name, message } = createTestimonialDto;
      const testimonial = await this.prisma.testimonial.create({
        data: {
          name,
          message,
        },
      });
      return testimonial;
    } catch (error) {
      return httpErrorException(error);
    }
  }

  async findAll() {
    return await this.prisma.testimonial.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.testimonial.findFirst({ where: { id } });
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto) {
    try {
      const { name } = updateTestimonialDto;
      const testimonial = await this.prisma.testimonial.update({
        where: { id },
        data: {
          name,
          ...updateTestimonialDto,
        },
      });
      return testimonial;
    } catch (error) {
      return httpErrorException(error);
    }
  }

  async remove(id: string) {
    return await this.prisma.testimonial.delete({ where: { id } });
  }
}
