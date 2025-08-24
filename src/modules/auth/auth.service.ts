import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { httpErrorException } from 'src/core/services/utility.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO, RegisterDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(userData: RegisterDTO): Promise<any> {
    // Validate password strength
    this.validatePasswordStrength(userData.password);

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ForbiddenException('Email already registered, try logging in.');
    }

    // Validate name length
    if (userData.name.length > 50) {
      throw new ForbiddenException('Name cannot be more than 50 characters');
    }

    if (userData.name.length < 2) {
      throw new ForbiddenException('Name must be at least 2 characters');
    }

    try {
      // Hash password with better security
      const passwordHash = await hash(userData.password, {
        type: 2, // Argon2id
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,
        parallelism: 1,
      });

      // Create user with default role
      const user = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: passwordHash,
          isVendor: userData.isVendor,
          avatar:
            'https://aui.atlassian.com/aui/9.3/docs/images/avatar-person.svg',
        },
      });

      // Remove sensitive data
      const { password, ...userWithoutPassword } = user;

      // Generate tokens
      const tokens = await this.generateTokens(userWithoutPassword);

      // Update refresh token in database
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return {
        user: userWithoutPassword,
        ...tokens,
        message: 'User registered successfully',
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw httpErrorException(error);
    }
  }

  async login(loginData: LoginDTO, passwordlessLogin?: boolean): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginData.email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          isAdmin: true,
          isVendor: true,
          isUserBan: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (user.isUserBan) {
        throw new ForbiddenException(
          'Your account has been banned. Please contact support.',
        );
      }

      // Check if user is trying to access admin area
      if (user.isAdmin === true && !passwordlessLogin) {
        throw new ForbiddenException('You are not allowed to login here');
      }

      // Verify password (unless passwordless login)
      if (!passwordlessLogin) {
        const isPasswordValid = await verify(user.password, loginData.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid email or password');
        }
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Update refresh token
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      // Get user roles
      const roles = this.getUserRoles(user);

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          roles,
          isAdmin: user.isAdmin,
          isVendor: user.isVendor,
        },
        message: 'Login successful',
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Login failed. Please try again.');
    }
  }

  async generateTokens(user: any): Promise<any> {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isVendor: user.isVendor,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'), // Shorter access token
        secret: this.config.get('JWT_SECRET'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'), // Longer refresh token
        secret: this.config.get('JWT_RefreshSecret'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      // Verify refresh token
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get('JWT_RefreshSecret'),
      });

      // Get fresh user data
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          isVendor: true,
          isUserBan: true,
          avatar: true,
        },
      });

      if (!user || user.isUserBan) {
        throw new UnauthorizedException('User not found or banned');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update refresh token
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          roles: this.getUserRoles(user),
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<any> {
    try {
      // Clear refresh token
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      return { message: 'Logout successful' };
    } catch (error) {
      throw new BadRequestException('Logout failed');
    }
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenHash = await hash(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: refreshTokenHash },
    });
  }

  private validatePasswordStrength(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    if (!/(?=.*[a-z])/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one lowercase letter',
      );
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter',
      );
    }

    if (!/(?=.*\d)/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one number',
      );
    }

    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one special character',
      );
    }
  }

  private getUserRoles(user: any): string[] {
    const roles = [];

    if (user.isAdmin) {
      roles.push('admin');
    }

    if (user.isVendor) {
      roles.push('vendor');
    }

    if (!user.isAdmin && !user.isVendor) {
      roles.push('user');
    }

    return roles;
  }

  // Additional security methods
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify old password
    const isOldPasswordValid = await verify(user.password, oldPassword);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Validate new password
    this.validatePasswordStrength(newPassword);

    // Hash new password
    const newPasswordHash = await hash(newPassword, {
      type: 2,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists or not
      return {
        message: 'If the email exists, a password reset link has been sent',
      };
    }

    // Generate reset token
    const resetToken = await this.jwt.signAsync(
      { id: user.id, email: user.email },
      {
        expiresIn: '1h',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    // In a real app, send email with reset link
    // For now, just return the token
    return {
      message: 'Password reset link sent to your email',
      resetToken, // Remove this in production
    };
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<any> {
    try {
      // Verify reset token
      const payload = await this.jwt.verifyAsync(resetToken, {
        secret: this.config.get('JWT_SECRET'),
      });

      // Validate new password
      this.validatePasswordStrength(newPassword);

      // Hash new password
      const newPasswordHash = await hash(newPassword, {
        type: 2,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });

      // Update password
      await this.prisma.user.update({
        where: { id: payload.id },
        data: { password: newPasswordHash },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }
}
