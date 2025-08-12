import { PrismaService } from '../../prisma/prisma.service';
import { AddToWishlistDto } from './dto';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserWishlist(userId: string, page?: number, limit?: number): Promise<{
        wishlistItems: {
            id: string;
            createdAt: Date;
            userId: string;
            productId: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto): Promise<{
        product: {
            name: string;
            id: string;
            price: number;
            salePrice: number;
            images: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        message: string;
    }>;
    clearWishlist(userId: string): Promise<{
        message: string;
    }>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
    getWishlistCount(userId: string): Promise<number>;
    moveToCart(userId: string, productId: string): Promise<{
        message: string;
    }>;
}
