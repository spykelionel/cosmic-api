import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    // Get user's cart items
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate totals and validate stock
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
      const product = cartItem.product;
      const price = product.salePrice || product.price;
      const itemTotal = price * cartItem.quantity;
      totalAmount += itemTotal;

      // Check stock
      if (product.stock < cartItem.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }

      orderItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        price: price,
      });
    }

    // Create address
    const address = await this.prisma.address.create({
      data: {
        userId,
        type: createOrderDto.addressType as any,
        firstName: createOrderDto.firstName,
        lastName: createOrderDto.lastName,
        company: createOrderDto.company,
        addressLine1: createOrderDto.addressLine1,
        addressLine2: createOrderDto.addressLine2,
        city: createOrderDto.city,
        state: createOrderDto.state,
        postalCode: createOrderDto.postalCode,
        country: createOrderDto.country,
        phone: createOrderDto.phone,
      },
    });

    // Generate order number
    const orderNumber = `CSTORE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount,
          shippingAddressId: address.id,
          billingAddressId: address.id,
          notes: createOrderDto.notes,
        },
      });

      // Create order items

      for (const item of orderItems) {
        await prisma.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });

        // Update product stock
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create payment record
      await prisma.payment.create({
        data: {
          orderId: newOrder.id,
          amount: totalAmount,
          paymentMethod: createOrderDto.paymentMethod as any,
          status: 'PENDING' as any,
        },
      });

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    // Return order with details
    return this.findOrderById(order.id, userId);
  }

  async findUserOrders(userId: string, query: any = {}) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * +limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  price: true,
                  salePrice: true,
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
          payment: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page: +page,
        limit: +limit,
        total,
        pages: Math.ceil(total / +limit),
      },
    };
  }

  async findOrderById(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                salePrice: true,
                description: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    // Update order status
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' as any },
    });

    // Restore product stock
    for (const item of order.orderItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    // Update payment status
    await this.prisma.payment.update({
      where: { orderId },
      data: { status: 'REFUNDED' },
    });

    return { message: 'Order cancelled successfully' };
  }

  async getVendorOrders(vendorId: string, query: any = {}) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * +limit;

    const where: any = {
      orderItems: {
        some: {
          product: {
            vendorId,
          },
        },
      },
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            where: {
              product: {
                vendorId,
              },
            },
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  price: true,
                  salePrice: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page: +page,
        limit: +limit,
        total,
        pages: Math.ceil(total / +limit),
      },
    };
  }

  async updateOrderStatus(
    orderId: string,
    vendorId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        orderItems: {
          some: {
            product: {
              vendorId,
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(
        'Order not found or you are not authorized to update it',
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: updateOrderStatusDto.status,
        notes: updateOrderStatusDto.notes,
      },
    });

    return updatedOrder;
  }

  async getVendorStats(vendorId: string) {
    const [totalProducts, totalOrders, totalRevenue, orderStatusCounts] =
      await Promise.all([
        this.prisma.product.count({
          where: { vendorId, isActive: true },
        }),
        this.prisma.order.count({
          where: {
            orderItems: {
              some: {
                product: {
                  vendorId,
                },
              },
            },
          },
        }),
        this.prisma.order.aggregate({
          where: {
            orderItems: {
              some: {
                product: {
                  vendorId,
                },
              },
            },
            status: {
              in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
            },
          },
          _sum: {
            totalAmount: true,
          },
        }),
        this.prisma.order.groupBy({
          by: ['status'],
          where: {
            orderItems: {
              some: {
                product: {
                  vendorId,
                },
              },
            },
          },
          _count: {
            status: true,
          },
        }),
      ]);

    return {
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      orderStatusCounts: orderStatusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
    };
  }
}
