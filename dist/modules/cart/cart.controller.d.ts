import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<{
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
    addToCart(addToCartDto: AddToCartDto, req: any): Promise<{
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
    updateCartItem(itemId: string, updateCartItemDto: UpdateCartItemDto, req: any): Promise<{
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
    removeFromCart(itemId: string, req: any): Promise<{
        message: string;
    }>;
    clearCart(req: any): Promise<{
        message: string;
    }>;
}
