"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminStatsQueryDto = exports.UpdateUserStatusDto = exports.UpdateUserRoleDto = exports.UserStatus = exports.UserRole = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["VENDOR"] = "VENDOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
    UserStatus["BANNED"] = "BANNED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
class UpdateUserRoleDto {
}
exports.UpdateUserRoleDto = UpdateUserRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New user role',
        enum: UserRole,
        example: UserRole.VENDOR,
    }),
    (0, class_validator_1.IsEnum)(UserRole),
    __metadata("design:type", String)
], UpdateUserRoleDto.prototype, "role", void 0);
class UpdateUserStatusDto {
}
exports.UpdateUserStatusDto = UpdateUserStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New user status',
        enum: UserStatus,
        example: UserStatus.ACTIVE,
    }),
    (0, class_validator_1.IsEnum)(UserStatus),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for status change',
        required: false,
        example: 'Account suspended due to policy violation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "reason", void 0);
class AdminStatsQueryDto {
}
exports.AdminStatsQueryDto = AdminStatsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date for statistics (ISO string)',
        required: false,
        example: '2024-01-01T00:00:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminStatsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date for statistics (ISO string)',
        required: false,
        example: '2024-12-31T23:59:59.999Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminStatsQueryDto.prototype, "endDate", void 0);
//# sourceMappingURL=admin.dto.js.map