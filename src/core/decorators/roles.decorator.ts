import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/admin/dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// Convenience decorators for common role combinations
export const AdminOnly = () => Roles(UserRole.ADMIN);
export const VendorOnly = () => Roles(UserRole.VENDOR);
export const AdminOrVendor = () => Roles(UserRole.ADMIN, UserRole.VENDOR);
export const AuthenticatedUser = () => Roles(UserRole.USER, UserRole.VENDOR, UserRole.ADMIN); 