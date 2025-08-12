import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(userData: RegisterDTO): Promise<any>;
    registerAdmin(userData: RegisterDTO, req: any): Promise<any>;
    login(loginData: LoginDTO): Promise<any>;
    refreshToken(data: any): Promise<any>;
    adminLogin(loginData: LoginDTO): Promise<{
        access_token: string;
    }>;
    resetPassword(email: string, newPassword: string, refreshToken: string): Promise<any>;
    updateUser(id: string, updateData: any): Promise<any>;
    getUsers(): Promise<{
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
