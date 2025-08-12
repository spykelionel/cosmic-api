import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, productId: string, createReviewDto: CreateReviewDto) {
    const { rating, comment } = createReviewDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user has already reviewed this product
    const existingReview = await this.prisma.review.findFirst({
      where: { userId, productId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // Check if user has purchased this product (optional validation)
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
      },
    });

    if (!hasPurchased) {
      throw new BadRequestException('You can only review products you have purchased');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update product average rating
    await this.updateProductRating(productId);

    return review;
  }

  async getProductReviews(productId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: { productId },
      }),
    ]);

    // Calculate average rating
    const averageRating = await this.calculateAverageRating(productId);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      averageRating,
    };
  }

  async updateReview(userId: string, reviewId: string, updateReviewDto: UpdateReviewDto) {
    // Check if review exists and belongs to user
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw new NotFoundException('Review not found or you are not authorized to edit it');
    }

    // Update review
    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: updateReviewDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update product average rating
    await this.updateProductRating(review.productId);

    return updatedReview;
  }

  async deleteReview(userId: string, reviewId: string) {
    // Check if review exists and belongs to user
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw new NotFoundException('Review not found or you are not authorized to delete it');
    }

    // Delete review
    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Update product average rating
    await this.updateProductRating(review.productId);

    return { message: 'Review deleted successfully' };
  }

  async getUserReviews(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: { userId },
      }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getVendorProductReviews(vendorId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          product: {
            vendorId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: {
          product: {
            vendorId,
          },
        },
      }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  private async calculateAverageRating(productId: string): Promise<number> {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return result._avg.rating || 0;
  }

  private async updateProductRating(productId: string): Promise<void> {
    const averageRating = await this.calculateAverageRating(productId);

    await this.prisma.product.update({
      where: { id: productId },
      data: { averageRating },
    });
  }
} 