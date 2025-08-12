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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let WishlistService = class WishlistService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserWishlist(userId, page = 1, limit = 20) {
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
    async addToWishlist(userId, addToWishlistDto) {
        const { productId } = addToWishlistDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingItem = await this.prisma.wishlistItem.findFirst({
            where: { userId, productId },
        });
        if (existingItem) {
            throw new common_1.BadRequestException('Product is already in your wishlist');
        }
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
    async removeFromWishlist(userId, productId) {
        const wishlistItem = await this.prisma.wishlistItem.findFirst({
            where: { userId, productId },
        });
        if (!wishlistItem) {
            throw new common_1.NotFoundException('Product not found in wishlist');
        }
        await this.prisma.wishlistItem.delete({
            where: { id: wishlistItem.id },
        });
        return { message: 'Product removed from wishlist successfully' };
    }
    async clearWishlist(userId) {
        await this.prisma.wishlistItem.deleteMany({
            where: { userId },
        });
        return { message: 'Wishlist cleared successfully' };
    }
    async isInWishlist(userId, productId) {
        const wishlistItem = await this.prisma.wishlistItem.findFirst({
            where: { userId, productId },
        });
        return !!wishlistItem;
    }
    async getWishlistCount(userId) {
        return this.prisma.wishlistItem.count({
            where: { userId },
        });
    }
    async moveToCart(userId, productId) {
        const wishlistItem = await this.prisma.wishlistItem.findFirst({
            where: { userId, productId },
        });
        if (!wishlistItem) {
            throw new common_1.NotFoundException('Product not found in wishlist');
        }
        const existingCartItem = await this.prisma.cartItem.findFirst({
            where: { userId, productId },
        });
        if (existingCartItem) {
            throw new common_1.BadRequestException('Product is already in your cart');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product || product.stock <= 0) {
            throw new common_1.BadRequestException('Product is out of stock');
        }
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
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map