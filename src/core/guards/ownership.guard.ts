import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { OWNERSHIP_KEY } from '../decorators/ownership.decorator';

export interface OwnershipConfig {
  model: string;
  idParam: string;
  userIdField: string;
  allowAdmin?: boolean;
  allowVendor?: boolean;
}

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ownershipConfig = this.reflector.getAllAndOverride<OwnershipConfig>(
      OWNERSHIP_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!ownershipConfig) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    if (!user) {
      return false;
    }

    // Allow admins to access everything
    if (ownershipConfig.allowAdmin && user.isAdmin) {
      return true;
    }

    // Allow vendors to access their own resources
    if (ownershipConfig.allowVendor && user.isVendor) {
      const resourceId = params[ownershipConfig.idParam];
      if (resourceId) {
        const resource = await this.prisma[ownershipConfig.model].findUnique({
          where: { id: resourceId },
          select: { [ownershipConfig.userIdField]: true },
        });

        if (resource && resource[ownershipConfig.userIdField] === user.id) {
          return true;
        }
      }
    }

    // Check if user owns the resource
    const resourceId = params[ownershipConfig.idParam];
    if (resourceId) {
      const resource = await this.prisma[ownershipConfig.model].findUnique({
        where: { id: resourceId },
        select: { [ownershipConfig.userIdField]: true },
      });

      if (resource && resource[ownershipConfig.userIdField] === user.id) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
