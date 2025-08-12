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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCurrentUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                isVendor: true,
                createdAt: true,
                updatedAt: true,
                addresses: {
                    where: { isDefault: true },
                    select: {
                        id: true,
                        type: true,
                        firstName: true,
                        lastName: true,
                        company: true,
                        addressLine1: true,
                        addressLine2: true,
                        city: true,
                        state: true,
                        postalCode: true,
                        country: true,
                        phone: true,
                        isDefault: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, updateProfileDto) {
        const { firstName, lastName, phone } = updateProfileDto;
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                isVendor: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        return { message: 'Password updated successfully' };
    }
    async getUserAddresses(userId) {
        const addresses = await this.prisma.address.findMany({
            where: { userId },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
            ],
        });
        return addresses;
    }
    async addAddress(userId, createAddressDto) {
        const { isDefault, ...addressData } = createAddressDto;
        if (isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        const address = await this.prisma.address.create({
            data: {
                ...addressData,
                userId,
                isDefault: isDefault || false,
            },
        });
        return address;
    }
    async updateAddress(userId, addressId, updateAddressDto) {
        const { isDefault, ...addressData } = updateAddressDto;
        const existingAddress = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!existingAddress) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, id: { not: addressId } },
                data: { isDefault: false },
            });
        }
        const updatedAddress = await this.prisma.address.update({
            where: { id: addressId },
            data: {
                ...addressData,
                isDefault: isDefault || false,
            },
        });
        return updatedAddress;
    }
    async removeAddress(userId, addressId) {
        const address = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (address.isDefault) {
            const nextAddress = await this.prisma.address.findFirst({
                where: { userId, id: { not: addressId } },
                orderBy: { createdAt: 'desc' },
            });
            if (nextAddress) {
                await this.prisma.address.update({
                    where: { id: nextAddress.id },
                    data: { isDefault: true },
                });
            }
        }
        await this.prisma.address.delete({
            where: { id: addressId },
        });
        return { message: 'Address removed successfully' };
    }
    async setDefaultAddress(userId, addressId) {
        const address = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        await this.prisma.address.updateMany({
            where: { userId, id: { not: addressId } },
            data: { isDefault: false },
        });
        const updatedAddress = await this.prisma.address.update({
            where: { id: addressId },
            data: { isDefault: true },
        });
        return updatedAddress;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map