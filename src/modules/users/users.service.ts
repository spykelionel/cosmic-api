import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getCurrentUser(userId: string) {
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
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
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

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get current user with password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async getUserAddresses(userId: string) {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return addresses;
  }

  async addAddress(userId: string, createAddressDto: CreateAddressDto) {
    const { isDefault, ...addressData } = createAddressDto;

    // If this is the first address or marked as default, set it as default
    if (isDefault) {
      // Remove default from all other addresses
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

  async updateAddress(userId: string, addressId: string, updateAddressDto: UpdateAddressDto) {
    const { isDefault, ...addressData } = updateAddressDto;

    // Check if address belongs to user
    const existingAddress = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    // If setting this address as default, remove default from others
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

  async removeAddress(userId: string, addressId: string) {
    // Check if address belongs to user
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // If removing default address, set another address as default
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

  async setDefaultAddress(userId: string, addressId: string) {
    // Check if address belongs to user
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Remove default from all other addresses
    await this.prisma.address.updateMany({
      where: { userId, id: { not: addressId } },
      data: { isDefault: false },
    });

    // Set this address as default
    const updatedAddress = await this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return updatedAddress;
  }
} 