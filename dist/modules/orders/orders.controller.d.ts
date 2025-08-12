import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDto: CreateOrderDto, req: any): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        orderItems: ({
            product: {
                id: string;
                name: string;
                description: string;
                price: number;
                salePrice: number;
                images: string[];
            };
        } & {
            id: string;
            quantity: number;
            price: number;
            createdAt: Date;
            orderId: string;
            productId: string;
        })[];
        payment: {
            id: string;
            amount: number;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            paymentMethod: string;
            transactionId: string;
            metadata: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
        };
        shippingAddress: {
            id: string;
            type: import(".prisma/client").$Enums.AddressType;
            firstName: string;
            lastName: string;
            company: string;
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            phone: string;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
        billingAddress: {
            id: string;
            type: import(".prisma/client").$Enums.AddressType;
            firstName: string;
            lastName: string;
            company: string;
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            phone: string;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        shippingFee: number;
        taxAmount: number;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shippingAddressId: string;
        billingAddressId: string;
    }>;
    getUserOrders(query: any, req: any): Promise<{
        orders: ({
            orderItems: ({
                product: {
                    id: string;
                    name: string;
                    price: number;
                    salePrice: number;
                    images: string[];
                };
            } & {
                id: string;
                quantity: number;
                price: number;
                createdAt: Date;
                orderId: string;
                productId: string;
            })[];
            payment: {
                id: string;
                amount: number;
                currency: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                paymentMethod: string;
                transactionId: string;
                metadata: import(".prisma/client").Prisma.JsonValue;
                createdAt: Date;
                updatedAt: Date;
                orderId: string;
            };
            shippingAddress: {
                id: string;
                type: import(".prisma/client").$Enums.AddressType;
                firstName: string;
                lastName: string;
                company: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
                phone: string;
                isDefault: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
            billingAddress: {
                id: string;
                type: import(".prisma/client").$Enums.AddressType;
                firstName: string;
                lastName: string;
                company: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
                phone: string;
                isDefault: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
        } & {
            id: string;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            totalAmount: number;
            shippingFee: number;
            taxAmount: number;
            notes: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shippingAddressId: string;
            billingAddressId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getOrderById(orderId: string, req: any): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        orderItems: ({
            product: {
                id: string;
                name: string;
                description: string;
                price: number;
                salePrice: number;
                images: string[];
            };
        } & {
            id: string;
            quantity: number;
            price: number;
            createdAt: Date;
            orderId: string;
            productId: string;
        })[];
        payment: {
            id: string;
            amount: number;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            paymentMethod: string;
            transactionId: string;
            metadata: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
        };
        shippingAddress: {
            id: string;
            type: import(".prisma/client").$Enums.AddressType;
            firstName: string;
            lastName: string;
            company: string;
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            phone: string;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
        billingAddress: {
            id: string;
            type: import(".prisma/client").$Enums.AddressType;
            firstName: string;
            lastName: string;
            company: string;
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            phone: string;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        shippingFee: number;
        taxAmount: number;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shippingAddressId: string;
        billingAddressId: string;
    }>;
    cancelOrder(orderId: string, req: any): Promise<{
        message: string;
    }>;
}
export declare class VendorOrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getVendorOrders(query: any, req: any): Promise<{
        orders: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
            orderItems: ({
                product: {
                    id: string;
                    name: string;
                    price: number;
                    salePrice: number;
                    images: string[];
                };
            } & {
                id: string;
                quantity: number;
                price: number;
                createdAt: Date;
                orderId: string;
                productId: string;
            })[];
            shippingAddress: {
                id: string;
                type: import(".prisma/client").$Enums.AddressType;
                firstName: string;
                lastName: string;
                company: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
                phone: string;
                isDefault: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
            billingAddress: {
                id: string;
                type: import(".prisma/client").$Enums.AddressType;
                firstName: string;
                lastName: string;
                company: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
                phone: string;
                isDefault: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
        } & {
            id: string;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            totalAmount: number;
            shippingFee: number;
            taxAmount: number;
            notes: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shippingAddressId: string;
            billingAddressId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateOrderStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto, req: any): Promise<{
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        shippingFee: number;
        taxAmount: number;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shippingAddressId: string;
        billingAddressId: string;
    }>;
    getVendorStats(req: any): Promise<{
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        orderStatusCounts: {};
    }>;
}
