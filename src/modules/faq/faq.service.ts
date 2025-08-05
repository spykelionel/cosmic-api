import { Injectable } from '@nestjs/common';
import { httpErrorException } from 'src/core/services/utility.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createFaqDto: CreateFaqDto) {
    try {
      const { question, answer } = createFaqDto;
      const faq = await this.prisma.faq.create({
        data: {
          question,
          answer,
        },
      });
      return faq;
    } catch (error) {
      return httpErrorException(error);
    }
  }

  async findAll() {
    return await this.prisma.faq.findMany();
  }

  findOne(id: string) {
    return this.prisma.faq.findFirst({ where: { id } });
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    try {
      const faq = await this.prisma.faq.findFirst({ where: { id } });
      if (!faq) {
        return 'No FAQ with such ID exist';
      }
      const { question, answer } = updateFaqDto;
      const updatedFaq = await this.prisma.faq.update({
        where: { id },
        data: {
          question,
          answer,
        },
      });
      return updatedFaq;
    } catch (error) {
      return httpErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const faq = await this.prisma.faq.findFirst({ where: { id } });
      if (!faq) {
        return 'No FAQ with such ID exist';
      }
      const deletedFaq = await this.prisma.faq.delete({
        where: { id },
      });
      return deletedFaq;
    } catch (error) {
      return httpErrorException(error);
    }
  }
}
