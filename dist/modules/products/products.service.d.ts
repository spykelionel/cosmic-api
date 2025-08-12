import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(createProductDto: CreateProductDto, vendorId: string): Promise<{
        category: {
            id: string;
            name: string;
            description: string;
            image: string;
            createdAt: Date;
            updatedAt: Date;
        };
        vendor: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        price: number;
        salePrice: number;
        images: string[];
        stock: number;
        sku: string;
        weight: number;
        dimensions: string;
        isActive: boolean;
        isFeatured: boolean;
        isOnSale: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        vendorId: string;
    }>;
    findAllProducts(query?: any): Promise<{
        products: {
            averageRating: number;
            reviewCount: number;
            category: {
                id: string;
                name: string;
                description: string;
                image: string;
                createdAt: Date;
                updatedAt: Date;
            };
            reviews: {
                rating: number;
            }[];
            vendor: {
                name: string;
                id: string;
            };
            id: string;
            name: string;
            description: string;
            price: number;
            salePrice: number;
            images: string[];
            stock: number;
            sku: string;
            weight: number;
            dimensions: string;
            isActive: boolean;
            isFeatured: boolean;
            isOnSale: boolean;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            vendorId: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findProductById(id: string): Promise<{
        averageRating: number;
        reviewCount: number;
        category: {
            id: string;
            name: string;
            description: string;
            image: string;
            createdAt: Date;
            updatedAt: Date;
        };
        reviews: ({
            user: {
                name: string;
                id: string;
                avatar: string;
            };
        } & {
            id: string;
            rating: number;
            comment: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
        })[];
        vendor: {
            name: string;
            email: string;
            id: string;
        };
        id: string;
        name: string;
        description: string;
        price: number;
        salePrice: number;
        images: string[];
        stock: number;
        sku: string;
        weight: number;
        dimensions: string;
        isActive: boolean;
        isFeatured: boolean;
        isOnSale: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        vendorId: string;
    }>;
    updateProduct(id: string, updateProductDto: UpdateProductDto, userId: string, isAdmin: boolean): Promise<{
        category: {
            id: string;
            name: string;
            description: string;
            image: string;
            createdAt: Date;
            updatedAt: Date;
        };
        vendor: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        price: number;
        salePrice: number;
        images: string[];
        stock: number;
        sku: string;
        weight: number;
        dimensions: string;
        isActive: boolean;
        isFeatured: boolean;
        isOnSale: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        vendorId: string;
    }>;
    deleteProduct(id: string, userId: string, isAdmin: boolean): Promise<{
        message: string;
    }>;
    getCategories(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        description: string;
        image: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getProductsByCategory(categoryId: string, query?: any): Promise<{
        category: {
            id: string;
            name: string;
            description: string;
            image: string;
            createdAt: Date;
            updatedAt: Date;
        };
        products: {
            averageRating: number;
            reviewCount: number;
            category: {
                id: string;
                name: string;
                description: string;
                image: string;
                createdAt: Date;
                updatedAt: Date;
            };
            reviews: {
                rating: number;
            }[];
            vendor: {
                name: string;
                id: string;
            };
            id: string;
            name: string;
            description: string;
            price: number;
            salePrice: number;
            images: string[];
            stock: number;
            sku: string;
            weight: number;
            dimensions: string;
            isActive: boolean;
            isFeatured: boolean;
            isOnSale: boolean;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            vendorId: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    searchProducts(query: string, filters?: any): Promise<{
        query: string;
        products: {
            averageRating: number;
            reviewCount: number;
            category: {
                id: string;
                name: string;
                description: string;
                image: string;
                createdAt: Date;
                updatedAt: Date;
            };
            reviews: {
                rating: number;
            }[];
            vendor: {
                name: string;
                id: string;
            };
            id: string;
            name: string;
            description: string;
            price: number;
            salePrice: number;
            images: string[];
            stock: number;
            sku: string;
            weight: number;
            dimensions: string;
            isActive: boolean;
            isFeatured: boolean;
            isOnSale: boolean;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            vendorId: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getAvailableFilters(): Promise<{
        categories: {
            name: string;
            id: string;
        }[];
        priceRange: {
            min: number;
            max: number;
        };
    }>;
    getVendorProducts(vendorId: string): Promise<({
        category: {
            id: string;
            name: string;
            description: string;
            image: string;
            createdAt: Date;
            updatedAt: Date;
        };
        reviews: {
            rating: number;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        price: number;
        salePrice: number;
        images: string[];
        stock: number;
        sku: string;
        weight: number;
        dimensions: string;
        isActive: boolean;
        isFeatured: boolean;
        isOnSale: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        vendorId: string;
    })[]>;
}
