import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    // Check if category name already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    // Check if new name conflicts with existing category
    if (
      updateCategoryDto.name &&
      updateCategoryDto.name !== existingCategory.name
    ) {
      const nameConflict = await this.prisma.category.findUnique({
        where: { name: updateCategoryDto.name },
      });

      if (nameConflict) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async deleteCategory(id: string) {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      throw new ConflictException(
        'Cannot delete category with existing products',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }

  async seedCategories() {
    const defaultCategories = [
      {
        name: 'Smartphones',
        description: 'Mobile phones and smartphones with advanced features',
        image:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      },
      {
        name: 'Laptops & Computers',
        description: 'Desktop computers, laptops, and computing devices',
        image:
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      },
      {
        name: 'Smartwatches',
        description: 'Wearable technology and smartwatches',
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      },
      {
        name: 'Cameras & Photography',
        description: 'Digital cameras, lenses, and photography equipment',
        image:
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
      },
      {
        name: 'Audio & Headphones',
        description: 'Headphones, speakers, and audio equipment',
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      },
      {
        name: 'Gaming & Consoles',
        description: 'Gaming consoles, accessories, and gaming equipment',
        image:
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
      },
      {
        name: 'Tablets & E-readers',
        description: 'Tablets, e-readers, and portable computing devices',
        image:
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      },
      {
        name: 'Home & Smart Devices',
        description: 'Smart home devices, IoT products, and home automation',
        image:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      },
      {
        name: 'Accessories & Peripherals',
        description: 'Computer accessories, cables, and peripheral devices',
        image:
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
      },
      {
        name: 'Wearable Technology',
        description: 'Fitness trackers, VR headsets, and wearable devices',
        image:
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      },
    ];

    const createdCategories = [];

    for (const categoryData of defaultCategories) {
      try {
        const category = await this.prisma.category.upsert({
          where: { name: categoryData.name },
          update: {},
          create: categoryData,
        });
        createdCategories.push(category);
      } catch (error) {
        console.log(
          `Category ${categoryData.name} already exists or error occurred:`,
          error.message,
        );
      }
    }

    return {
      message: `Successfully seeded ${createdCategories.length} categories`,
      categories: createdCategories,
    };
  }
}
