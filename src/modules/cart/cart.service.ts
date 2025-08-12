import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            vendor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Calculate totals
    let subtotal = 0;
    let totalItems = 0;

    cartItems.forEach(item => {
      const price = item.product.salePrice || item.product.price;
      subtotal += price * item.quantity;
      totalItems += item.quantity;
    });

    return {
      items: cartItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalItems,
    };
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Check if product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Check if item already exists in cart
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      // Update quantity if item exists
      const newQuantity = existingCartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock for requested quantity');
      }

      const updatedCartItem = await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              category: true,
              vendor: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return updatedCartItem;
    } else {
      // Create new cart item
      const newCartItem = await this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              category: true,
              vendor: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return newCartItem;
    }
  }

  async updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock availability
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const updatedCartItem = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true,
            vendor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return updatedCartItem;
  }

  async removeFromCart(userId: string, itemId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from cart successfully' };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { message: 'Cart cleared successfully' };
  }

  async getCartItemCount(userId: string) {
    const count = await this.prisma.cartItem.aggregate({
      where: { userId },
      _sum: {
        quantity: true,
      },
    });

    return count._sum.quantity || 0;
  }
} 