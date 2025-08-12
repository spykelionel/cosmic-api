import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RateLimit = (config: RateLimitConfig) => SetMetadata(RATE_LIMIT_KEY, config);

// Convenience decorators for common rate limiting patterns
export const StrictRateLimit = () => RateLimit({ maxRequests: 5, windowMs: 60000 }); // 5 requests per minute
export const ModerateRateLimit = () => RateLimit({ maxRequests: 20, windowMs: 60000 }); // 20 requests per minute
export const LooseRateLimit = () => RateLimit({ maxRequests: 100, windowMs: 60000 }); // 100 requests per minute

// Special rate limits for specific operations
export const AuthRateLimit = () => RateLimit({ maxRequests: 3, windowMs: 300000 }); // 3 auth attempts per 5 minutes
export const UploadRateLimit = () => RateLimit({ maxRequests: 10, windowMs: 60000 }); // 10 uploads per minute
export const SearchRateLimit = () => RateLimit({ maxRequests: 30, windowMs: 60000 }); // 30 searches per minute 