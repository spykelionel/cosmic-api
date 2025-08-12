import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';

export interface OwnershipConfig {
  model: string;
  idParam: string;
  userIdField: string;
  allowAdmin?: boolean;
  allowVendor?: boolean;
}

export const RequireOwnership = (config: OwnershipConfig) => SetMetadata(OWNERSHIP_KEY, config);

// Convenience decorators for common ownership patterns
export const OwnUser = () => RequireOwnership({
  model: 'user',
  idParam: 'userId',
  userIdField: 'id',
  allowAdmin: true,
});

export const OwnProduct = () => RequireOwnership({
  model: 'product',
  idParam: 'id',
  userIdField: 'vendorId',
  allowAdmin: true,
  allowVendor: true,
});

export const OwnOrder = () => RequireOwnership({
  model: 'order',
  idParam: 'orderId',
  userIdField: 'userId',
  allowAdmin: true,
});

export const OwnReview = () => RequireOwnership({
  model: 'review',
  idParam: 'reviewId',
  userIdField: 'userId',
  allowAdmin: true,
}); 