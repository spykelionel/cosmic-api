import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export enum UserRole {
  USER = 'USER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'New user role',
    enum: UserRole,
    example: UserRole.VENDOR,
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'New user status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({
    description: 'Reason for status change',
    required: false,
    example: 'Account suspended due to policy violation',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class AdminStatsQueryDto {
  @ApiProperty({
    description: 'Start date for statistics (ISO string)',
    required: false,
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for statistics (ISO string)',
    required: false,
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsString()
  endDate?: string;
} 