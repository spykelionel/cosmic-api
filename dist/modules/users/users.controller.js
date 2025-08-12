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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/guards/jwt.auth.guard");
const users_service_1 = require("./users.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const address_dto_1 = require("./dto/address.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getCurrentUser(req) {
        return this.usersService.getCurrentUser(req.user.id);
    }
    async updateProfile(req, updateProfileDto) {
        return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }
    async changePassword(req, changePasswordDto) {
        return this.usersService.changePassword(req.user.id, changePasswordDto);
    }
    async getUserAddresses(req) {
        return this.usersService.getUserAddresses(req.user.id);
    }
    async addAddress(req, createAddressDto) {
        return this.usersService.addAddress(req.user.id, createAddressDto);
    }
    async updateAddress(req, addressId, updateAddressDto) {
        return this.usersService.updateAddress(req.user.id, addressId, updateAddressDto);
    }
    async removeAddress(req, addressId) {
        return this.usersService.removeAddress(req.user.id, addressId);
    }
    async setDefaultAddress(req, addressId) {
        return this.usersService.setDefaultAddress(req.user.id, addressId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change user password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password changed successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('addresses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user addresses' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User addresses retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserAddresses", null);
__decorate([
    (0, common_1.Post)('addresses'),
    (0, swagger_1.ApiOperation)({ summary: 'Add new address' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Address added successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, address_dto_1.CreateAddressDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addAddress", null);
__decorate([
    (0, common_1.Put)('addresses/:addressId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update address' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Address updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('addressId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, address_dto_1.UpdateAddressDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.Delete)('addresses/:addressId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove address' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Address removed successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('addressId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeAddress", null);
__decorate([
    (0, common_1.Put)('addresses/:addressId/default'),
    (0, swagger_1.ApiOperation)({ summary: 'Set address as default' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Address set as default successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('addressId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setDefaultAddress", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map