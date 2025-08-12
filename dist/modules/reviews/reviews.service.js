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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(userId, productId, createReviewDto) {
        const { rating, comment } = createReviewDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingReview = await this.prisma.review.findFirst({
            where: { userId, productId },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this product');
        }
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
            throw new common_1.BadRequestException('You can only review products you have purchased');
        }
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
        await this.updateProductRating(productId);
        return review;
    }
    async getProductReviews(productId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
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
    async updateReview(userId, reviewId, updateReviewDto) {
        const review = await this.prisma.review.findFirst({
            where: { id: reviewId, userId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found or you are not authorized to edit it');
        }
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
        await this.updateProductRating(review.productId);
        return updatedReview;
    }
    async deleteReview(userId, reviewId) {
        const review = await this.prisma.review.findFirst({
            where: { id: reviewId, userId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found or you are not authorized to delete it');
        }
        await this.prisma.review.delete({
            where: { id: reviewId },
        });
        await this.updateProductRating(review.productId);
        return { message: 'Review deleted successfully' };
    }
    async getUserReviews(userId, page = 1, limit = 10) {
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
    async getVendorProductReviews(vendorId, page = 1, limit = 10) {
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
    async calculateAverageRating(productId) {
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
    async updateProductRating(productId) {
        const averageRating = await this.calculateAverageRating(productId);
        await this.prisma.product.update({
            where: { id: productId },
            data: { averageRating },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map