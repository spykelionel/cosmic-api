import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      // Get fresh user data from database
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
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.isUserBan) {
        throw new UnauthorizedException('User account is banned');
      }

      // Add role information
      const userWithRoles = {
        ...user,
        roles: this.getUserRoles(user),
      };

      return userWithRoles;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or user not found');
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
}
