export declare enum UserRole {
    USER = "USER",
    VENDOR = "VENDOR",
    ADMIN = "ADMIN"
}
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    BANNED = "BANNED"
}
export declare class UpdateUserRoleDto {
    role: UserRole;
}
export declare class UpdateUserStatusDto {
    status: UserStatus;
    reason?: string;
}
export declare class AdminStatsQueryDto {
    startDate?: string;
    endDate?: string;
}
