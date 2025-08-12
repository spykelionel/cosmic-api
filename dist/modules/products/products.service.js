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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(createProductDto, vendorId) {
        const category = await this.prisma.category.findUnique({
            where: { id: createProductDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const product = await this.prisma.product.create({
            data: {
                ...createProductDto,
                vendorId,
            },
            include: {
                category: true,
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return product;
    }
    async findAllProducts(query = {}) {
        const { page = 1, limit = 10, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', search, isFeatured, isOnSale, } = query;
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (category) {
            where.categoryId = category;
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = parseFloat(minPrice);
            if (maxPrice)
                where.price.lte = parseFloat(maxPrice);
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured === 'true';
        }
        if (isOnSale !== undefined) {
            where.isOnSale = isOnSale === 'true';
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    category: true,
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    reviews: {
                        select: {
                            rating: true,
                        },
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        const productsWithRating = products.map(product => ({
            ...product,
            averageRating: product.reviews.length > 0
                ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
                : 0,
            reviewCount: product.reviews.length,
        }));
        return {
            products: productsWithRating,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const averageRating = product.reviews.length > 0
            ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
            : 0;
        return {
            ...product,
            averageRating,
            reviewCount: product.reviews.length,
        };
    }
    async updateProduct(id, updateProductDto, userId, isAdmin) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { vendor: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!isAdmin && product.vendorId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        if (updateProductDto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: updateProductDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                category: true,
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return updatedProduct;
    }
    async deleteProduct(id, userId, isAdmin) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { vendor: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!isAdmin && product.vendorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own products');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
    async getCategories() {
        return this.prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }
    async getProductsByCategory(categoryId, query = {}) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where: { categoryId, isActive: true },
                skip,
                take: parseInt(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    category: true,
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    reviews: {
                        select: {
                            rating: true,
                        },
                    },
                },
            }),
            this.prisma.product.count({ where: { categoryId, isActive: true } }),
        ]);
        const productsWithRating = products.map(product => ({
            ...product,
            averageRating: product.reviews.length > 0
                ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
                : 0,
            reviewCount: product.reviews.length,
        }));
        return {
            category,
            products: productsWithRating,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async searchProducts(query, filters = {}) {
        const { page = 1, limit = 10, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        };
        if (category) {
            where.categoryId = category;
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = parseFloat(minPrice);
            if (maxPrice)
                where.price.lte = parseFloat(maxPrice);
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    category: true,
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    reviews: {
                        select: {
                            rating: true,
                        },
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        const productsWithRating = products.map(product => ({
            ...product,
            averageRating: product.reviews.length > 0
                ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
                : 0,
            reviewCount: product.reviews.length,
        }));
        return {
            query,
            products: productsWithRating,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getAvailableFilters() {
        const [categories, priceRange] = await Promise.all([
            this.prisma.category.findMany({
                select: { id: true, name: true },
            }),
            this.prisma.product.aggregate({
                where: { isActive: true },
                _min: { price: true },
                _max: { price: true },
            }),
        ]);
        return {
            categories,
            priceRange: {
                min: priceRange._min.price || 0,
                max: priceRange._max.price || 0,
            },
        };
    }
    async getVendorProducts(vendorId) {
        return this.prisma.product.findMany({
            where: { vendorId, isActive: true },
            include: {
                category: true,
                reviews: {
                    select: {
                        rating: true,
                    },
                },
            },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map