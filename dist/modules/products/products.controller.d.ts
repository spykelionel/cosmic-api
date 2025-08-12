import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, req: any): Promise<{
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
    findAll(query: any): Promise<{
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
    getProductsByCategory(categoryId: string, query: any): Promise<{
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
    filterProducts(filters: any): Promise<{
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
    searchProducts(query: string, filters: any): Promise<{
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
    }> | {
        products: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
    findOne(id: string): Promise<{
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
    update(id: string, updateProductDto: UpdateProductDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
export declare class VendorProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getVendorProducts(req: any): Promise<({
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
