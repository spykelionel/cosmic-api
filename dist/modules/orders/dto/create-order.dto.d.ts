export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    addressType: string;
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    notes?: string;
    paymentMethod: string;
}
