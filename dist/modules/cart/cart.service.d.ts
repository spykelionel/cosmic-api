import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            quantity: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
        })[];
        subtotal: number;
        totalItems: number;
    }>;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{
        product: {
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
        };
    } & {
        id: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        product: {
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
        };
    } & {
        id: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    removeFromCart(userId: string, itemId: string): Promise<{
        message: string;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
    getCartItemCount(userId: string): Promise<number>;
}
