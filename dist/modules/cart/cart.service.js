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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
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
    async addToCart(userId, addToCartDto) {
        const { productId, quantity } = addToCartDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.isActive) {
            throw new common_1.BadRequestException('Product is not available');
        }
        if (product.stock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        const existingCartItem = await this.prisma.cartItem.findFirst({
            where: {
                userId,
                productId,
            },
        });
        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new common_1.BadRequestException('Insufficient stock for requested quantity');
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
        }
        else {
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
    async updateCartItem(userId, itemId, updateCartItemDto) {
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
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.product.stock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
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
    async removeFromCart(userId, itemId) {
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                userId,
            },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return { message: 'Item removed from cart successfully' };
    }
    async clearCart(userId) {
        await this.prisma.cartItem.deleteMany({
            where: { userId },
        });
        return { message: 'Cart cleared successfully' };
    }
    async getCartItemCount(userId) {
        const count = await this.prisma.cartItem.aggregate({
            where: { userId },
            _sum: {
                quantity: true,
            },
        });
        return count._sum.quantity || 0;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map