import { LoginDTO, RegisterDTO } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    jwtService: any;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    register(userData: RegisterDTO): Promise<any>;
    generateRandomPassword(length: number): string;
    generateTokens(user: any): Promise<any>;
    login(loginData: LoginDTO, passwordlessLogin?: boolean): Promise<any>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<any>;
    adminLogin(loginData: LoginDTO): Promise<{
        access_token: string;
    }>;
    registerAdmin(userData: RegisterDTO): Promise<any>;
    resetPassword(email: string, newPassword: string, refreshToken: string): Promise<any>;
    getUserIdFromToken(token: string): Promise<string | null>;
    updateUserProfile(user: any, userId: string): Promise<any>;
    getAllUsers(): Promise<{
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
    }[]>;
}
