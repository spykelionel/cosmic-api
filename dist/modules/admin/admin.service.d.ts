import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserRoleDto, UpdateUserStatusDto, AdminStatsQueryDto } from './dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllUsers(page?: number, limit?: number, search?: string): Promise<{
        users: {
            id: string;
            email: string;
            phoneNumber: string;
            occupation: string;
            country: string;
            socialMediaHandles: string[];
            fullName: string;
            name: string;
            password: string;
            refreshToken: string;
            avatar: string;
            isUserBan: boolean;
            isAdmin: boolean;
            isVendor: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getUserById(userId: string): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        occupation: string;
        country: string;
        socialMediaHandles: string[];
        fullName: string;
        name: string;
        password: string;
        refreshToken: string;
        avatar: string;
        isUserBan: boolean;
        isAdmin: boolean;
        isVendor: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        occupation: string;
        country: string;
        socialMediaHandles: string[];
        fullName: string;
        name: string;
        password: string;
        refreshToken: string;
        avatar: string;
        isUserBan: boolean;
        isAdmin: boolean;
        isVendor: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserStatus(userId: string, updateUserStatusDto: UpdateUserStatusDto): Promise<{
        message: string;
        userId: string;
        status: import("./dto").UserStatus;
        reason: string;
        updatedAt: Date;
    }>;
    getAllOrders(page?: number, limit?: number, status?: string): Promise<{
        orders: {
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getAdminStats(query: AdminStatsQueryDto): Promise<{
        overview: {
            totalUsers: number;
            totalVendors: number;
            totalProducts: number;
            totalOrders: number;
            totalRevenue: number;
        };
        orders: {
            pending: number;
            completed: number;
            cancelled: number;
            averageOrderValue: number;
        };
        topProducts: any;
        recentOrders: {
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
        }[];
        period: {
            startDate: string;
            endDate: string;
        };
    }>;
    getSystemHealth(): Promise<{
        status: string;
        timestamp: string;
        database: string;
        stats: any;
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        database: string;
        error: any;
        stats?: undefined;
    }>;
}
