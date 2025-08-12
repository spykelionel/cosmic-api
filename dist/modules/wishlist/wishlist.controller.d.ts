import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getUserWishlist(req: any, page: number, limit: number): Promise<{
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
    addToWishlist(req: any, addToWishlistDto: AddToWishlistDto): Promise<{
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
    removeFromWishlist(req: any, productId: string): Promise<{
        message: string;
    }>;
    clearWishlist(req: any): Promise<{
        message: string;
    }>;
    getWishlistCount(req: any): Promise<{
        count: number;
    }>;
    moveToCart(req: any, productId: string): Promise<{
        message: string;
    }>;
    checkWishlistStatus(req: any, productId: string): Promise<{
        isInWishlist: boolean;
    }>;
}
