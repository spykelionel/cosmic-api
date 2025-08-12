"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllUsers(page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    isVendor: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            orders: true,
                            reviews: true,
                            products: true,
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
    async getUserById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
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
                products: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        stock: true,
                        isActive: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                        products: true,
                        addresses: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUserRole(userId, updateUserRoleDto) {
        const { role } = updateUserRoleDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                isVendor: role === 'VENDOR',
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isVendor: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
    async updateUserStatus(userId, updateUserStatusDto) {
        const { status, reason } = updateUserStatusDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            message: `User status updated to ${status}`,
            userId,
            status,
            reason,
            updatedAt: new Date(),
        };
    }
    async getAllOrders(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
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
    async getAdminStats(query) {
        const { startDate, endDate } = query;
        const dateFilter = {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
        };
        const [totalUsers, totalVendors, totalProducts, totalOrders, totalRevenue, pendingOrders, completedOrders, cancelledOrders, averageOrderValue, topProducts, recentOrders,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({
                where: { isVendor: true },
            }),
            this.prisma.product.count({
                where: { isActive: true },
            }),
            this.prisma.order.count({
                where: {
                    createdAt: dateFilter,
                },
            }),
            this.prisma.order.aggregate({
                where: {
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                    createdAt: dateFilter,
                },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.count({
                where: {
                    status: { in: ['PENDING', 'PROCESSING'] },
                    createdAt: dateFilter,
                },
            }),
            this.prisma.order.count({
                where: {
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                    createdAt: dateFilter,
                },
            }),
            this.prisma.order.count({
                where: {
                    status: 'CANCELLED',
                    createdAt: dateFilter,
                },
            }),
            this.prisma.order.aggregate({
                where: {
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                    createdAt: dateFilter,
                },
                _avg: { totalAmount: true },
            }),
            this.prisma.orderItem.groupBy({
                by: ['productId'],
                where: {
                    order: {
                        status: { in: ['COMPLETED', 'DELIVERED'] },
                        createdAt: dateFilter,
                    },
                },
                _sum: { quantity: true },
                orderBy: {
                    _sum: { quantity: 'desc' },
                },
                take: 10,
            }),
            this.prisma.order.findMany({
                where: {
                    createdAt: dateFilter,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
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
        const topProductsWithDetails = await Promise.all(topProducts.map(async (item) => {
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
        }));
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
            await this.prisma.$queryRaw `SELECT 1`;
            const stats = await this.prisma.$queryRaw `
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
        }
        catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: error.message,
            };
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map