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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(userId, createOrderDto) {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: true,
            },
        });
        if (cartItems.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        let totalAmount = 0;
        const orderItems = [];
        for (const cartItem of cartItems) {
            const product = cartItem.product;
            const price = product.salePrice || product.price;
            const itemTotal = price * cartItem.quantity;
            totalAmount += itemTotal;
            if (product.stock < cartItem.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${product.name}`);
            }
            orderItems.push({
                productId: product.id,
                quantity: cartItem.quantity,
                price: price,
            });
        }
        const address = await this.prisma.address.create({
            data: {
                userId,
                type: createOrderDto.addressType,
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
        const orderNumber = `CSTORE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const order = await this.prisma.$transaction(async (prisma) => {
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
            for (const item of orderItems) {
                await prisma.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    },
                });
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            await prisma.payment.create({
                data: {
                    orderId: newOrder.id,
                    amount: totalAmount,
                    paymentMethod: createOrderDto.paymentMethod,
                    status: 'PENDING',
                },
            });
            await prisma.cartItem.deleteMany({
                where: { userId },
            });
            return newOrder;
        });
        return this.findOrderById(order.id, userId);
    }
    async findUserOrders(userId, query = {}) {
        const { page = 1, limit = 10, status } = query;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (status) {
            where.status = status;
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: parseInt(limit),
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
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOrderById(orderId, userId) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async cancelOrder(orderId, userId) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Order cannot be cancelled at this stage');
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
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
        await this.prisma.payment.update({
            where: { orderId },
            data: { status: 'REFUNDED' },
        });
        return { message: 'Order cancelled successfully' };
    }
    async getVendorOrders(vendorId, query = {}) {
        const { page = 1, limit = 10, status } = query;
        const skip = (page - 1) * limit;
        const where = {
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
                take: parseInt(limit),
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
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async updateOrderStatus(orderId, vendorId, updateOrderStatusDto) {
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
            throw new common_1.NotFoundException('Order not found or you are not authorized to update it');
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
    async getVendorStats(vendorId) {
        const [totalProducts, totalOrders, totalRevenue, orderStatusCounts,] = await Promise.all([
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map