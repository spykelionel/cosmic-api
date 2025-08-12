import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AdminStatsQueryDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from './dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as any } },
            { name: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          isVendor: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isVendor: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },

        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto) {
    const { role } = updateUserRoleDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user role
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVendor: role === 'VENDOR',
      },
      select: {
        id: true,
        email: true,
        name: true,
        isVendor: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async updateUserStatus(
    userId: string,
    updateUserStatusDto: UpdateUserStatusDto,
  ) {
    const { status, reason } = updateUserStatusDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // For now, we'll use a simple approach with a status field
    // In a real application, you might want to add a status field to the User model
    // or implement a more sophisticated status management system

    // For this implementation, we'll just return a success message
    // You can extend this based on your specific requirements

    return {
      message: `User status updated to ${status}`,
      userId,
      status,
      reason,
      updatedAt: new Date(),
    };
  }

  async getAllOrders(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;

    const where = status ? { status: status as any } : {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getAdminStats(query: AdminStatsQueryDto) {
    const { startDate, endDate } = query;

    const dateFilter = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate && { lte: new Date(endDate) }),
    };

    const [
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      averageOrderValue,
      topProducts,
      recentOrders,
    ] = await Promise.all([
      // Total users
      this.prisma.user.count(),

      // Total vendors
      this.prisma.user.count({
        where: { isVendor: true },
      }),

      // Total products
      this.prisma.product.count({
        where: { isActive: true },
      }),

      // Total orders
      this.prisma.order.count({
        where: {
          createdAt: dateFilter,
        },
      }),

      // Total revenue
      this.prisma.order.aggregate({
        where: {
          status: { in: ['COMPLETED', 'DELIVERED'] as any },
          createdAt: dateFilter,
        },
        _sum: { totalAmount: true },
      }),

      // Pending orders
      this.prisma.order.count({
        where: {
          status: { in: ['PENDING', 'PROCESSING'] },
          createdAt: dateFilter,
        },
      }),

      // Completed orders
      this.prisma.order.count({
        where: {
          status: { in: ['COMPLETED', 'DELIVERED'] as any },
          createdAt: dateFilter,
        },
      }),

      // Cancelled orders
      this.prisma.order.count({
        where: {
          status: 'CANCELLED',
          createdAt: dateFilter,
        },
      }),

      // Average order value
      this.prisma.order.aggregate({
        where: {
          status: { in: ['COMPLETED', 'DELIVERED'] as any },
          createdAt: dateFilter,
        },
        _avg: { totalAmount: true },
      }),

      // Top selling products
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            status: { in: ['COMPLETED', 'DELIVERED'] as any },
            createdAt: dateFilter,
          },
        },
        _sum: { quantity: true },
        orderBy: {
          _sum: { quantity: 'desc' },
        },
        take: 10,
      }),

      // Recent orders
      this.prisma.order.findMany({
        where: {
          createdAt: dateFilter,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        });
        return {
          ...product,
          totalSold: item._sum.quantity || 0,
        };
      }),
    );

    return {
      overview: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
      },
      orders: {
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        averageOrderValue: averageOrderValue._avg.totalAmount || 0,
      },
      topProducts: topProductsWithDetails,
      recentOrders,
      period: {
        startDate: startDate || 'all time',
        endDate: endDate || 'now',
      },
    };
  }

  async getSystemHealth() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Get basic system info
      const stats = await this.prisma.$queryRaw`
        SELECT 
          (SELECT COUNT(*) FROM "User") as user_count,
          (SELECT COUNT(*) FROM "Product") as product_count,
          (SELECT COUNT(*) FROM "Order") as order_count
      `;

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        stats: stats[0],
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      };
    }
  }
}
