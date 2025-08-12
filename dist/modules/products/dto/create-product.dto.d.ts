export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    stock: number;
    sku?: string;
    weight?: number;
    dimensions?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    isOnSale?: boolean;
    categoryId: string;
}
