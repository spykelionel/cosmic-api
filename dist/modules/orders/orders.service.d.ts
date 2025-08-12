import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<{
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
    findUserOrders(userId: string, query?: any): Promise<{
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
    findOrderById(orderId: string, userId: string): Promise<{
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
    cancelOrder(orderId: string, userId: string): Promise<{
        message: string;
    }>;
    getVendorOrders(vendorId: string, query?: any): Promise<{
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
    updateOrderStatus(orderId: string, vendorId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
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
    getVendorStats(vendorId: string): Promise<{
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        orderStatusCounts: {};
    }>;
}
