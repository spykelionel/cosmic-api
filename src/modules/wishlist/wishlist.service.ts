import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToWishlistDto } from './dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getUserWishlist(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [wishlistItems, total] = await Promise.all([
      this.prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              salePrice: true,
              images: true,
              stock: true,
              averageRating: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.wishlistItem.count({
        where: { userId },
      }),
    ]);

    return {
      wishlistItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto) {
    const { productId } = addToWishlistDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if product is already in wishlist
    const existingItem = await this.prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (existingItem) {
      throw new BadRequestException('Product is already in your wishlist');
    }

    // Add to wishlist
    const wishlistItem = await this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            salePrice: true,
            images: true,
          },
        },
      },
    });

    return wishlistItem;
  }

  async removeFromWishlist(userId: string, productId: string) {
    // Check if item exists in user's wishlist
    const wishlistItem = await this.prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    // Remove from wishlist
    await this.prisma.wishlistItem.delete({
      where: { id: wishlistItem.id },
    });

    return { message: 'Product removed from wishlist successfully' };
  }

  async clearWishlist(userId: string) {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId },
    });

    return { message: 'Wishlist cleared successfully' };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlistItem = await this.prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    return !!wishlistItem;
  }

  async getWishlistCount(userId: string): Promise<number> {
    return this.prisma.wishlistItem.count({
      where: { userId },
    });
  }

  async moveToCart(userId: string, productId: string) {
    // Check if product is in wishlist
    const wishlistItem = await this.prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    // Check if product is already in cart
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existingCartItem) {
      throw new BadRequestException('Product is already in your cart');
    }

    // Check product stock
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.stock <= 0) {
      throw new BadRequestException('Product is out of stock');
    }

    // Add to cart and remove from wishlist
    await this.prisma.$transaction([
      this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
      }),
      this.prisma.wishlistItem.delete({
        where: { id: wishlistItem.id },
      }),
    ]);

    return { message: 'Product moved to cart successfully' };
  }
} 