# 🚀 Enhanced Security Setup Guide for Cosmic E-commerce API

## 🔐 Environment Configuration

Create a `.env` file in your `cosmic-api` directory with the following configuration:

```env
# ========================================
# COSMIC E-COMMERCE API CONFIGURATION
# ========================================

# Database Configuration
DATABASE_URL="mongodb://localhost:27017/cosmic"
DATABASE_NAME="cosmic"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-minimum-32-characters"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
JWT_RefreshSecret="your-super-secret-refresh-key-change-this-in-production-minimum-32-characters"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App Configuration
PORT=3000
NODE_ENV=development
APP_NAME="Cosmic E-commerce API"
APP_VERSION="1.0.0"

# Security Configuration
API_KEY="your-api-key-for-external-services"
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (for password reset, notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@cosmic.com"

# Redis Configuration (for session management, caching)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0

# Payment Gateway Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES="jpg,jpeg,png,gif,webp,pdf,doc,docx"
UPLOAD_PATH="./uploads"

# Logging Configuration
LOG_LEVEL="info"
LOG_FORMAT="combined"
LOG_FILE="./logs/app.log"

# Monitoring & Analytics
SENTRY_DSN="your-sentry-dsn"
GOOGLE_ANALYTICS_ID="your-ga-id"

# Third-party Services
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
```

## 🔑 Generate Strong JWT Secrets

Use these commands to generate strong JWT secrets:

```bash
# Generate JWT Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Refresh Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate API Key (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🛡️ Security Features Implemented

### 1. **Authentication & Authorization**

- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (User, Vendor, Admin)
- ✅ Ownership-based resource protection
- ✅ Password strength validation
- ✅ Account ban protection

### 2. **Guards & Security**

- ✅ `JwtAuthGuard` - JWT token validation
- ✅ `RolesGuard` - Role-based access control
- ✅ `OwnershipGuard` - Resource ownership validation
- ✅ `RateLimitGuard` - API rate limiting
- ✅ `ApiKeyGuard` - External service authentication

### 3. **Rate Limiting**

- ✅ **Strict**: 5 requests per minute (auth operations)
- ✅ **Moderate**: 20 requests per minute (CRUD operations)
- ✅ **Loose**: 100 requests per minute (read operations)
- ✅ **Search**: 30 requests per minute (search operations)
- ✅ **Upload**: 10 requests per minute (file uploads)

### 4. **Password Security**

- ✅ Minimum 8 characters
- ✅ Uppercase and lowercase letters
- ✅ Numbers and special characters
- ✅ Argon2id hashing with high memory cost
- ✅ Secure password reset flow

### 5. **API Security**

- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ CSRF protection

## 🔒 Usage Examples

### Role-Based Access Control

```typescript
// Admin only endpoints
@AdminOnly()
@Get('admin/users')
async getAdminUsers() { ... }

// Vendor or Admin endpoints
@AdminOrVendor()
@Post('products')
async createProduct() { ... }

// Authenticated user endpoints
@AuthenticatedUser()
@Get('profile')
async getProfile() { ... }
```

### Ownership Protection

```typescript
// Protect product resources
@OwnProduct()
@Put('products/:id')
async updateProduct() { ... }

// Protect user resources
@OwnUser()
@Put('users/:userId')
async updateUser() { ... }
```

### Rate Limiting

```typescript
// Strict rate limiting for auth
@AuthRateLimit()
@Post('login')
async login() { ... }

// Moderate rate limiting for CRUD
@ModerateRateLimit()
@Post('products')
async createProduct() { ... }

// Search rate limiting
@SearchRateLimit()
@Get('search')
async searchProducts() { ... }
```

## 🚀 Getting Started

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Set Environment Variables**

- Copy the `.env` example above
- Generate strong JWT secrets
- Configure your database and Cloudinary

### 3. **Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (if needed)
npx prisma db seed
```

### 4. **Start the Application**

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 5. **Test Security Features**

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Check security coverage
npm run test:cov
```

## 🔍 Testing Security

### Test Authentication

```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"SecurePass123!"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

### Test Role-Based Access

```bash
# Try to access admin endpoint without admin role
curl -X GET http://localhost:3000/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Rate Limiting

```bash
# Make multiple rapid requests to see rate limiting
for i in {1..10}; do
  curl -X GET http://localhost:3000/products
done
```

## 🚨 Security Best Practices

### 1. **Production Deployment**

- ✅ Use HTTPS only
- ✅ Set `NODE_ENV=production`
- ✅ Use strong, unique JWT secrets
- ✅ Enable CORS with specific origins
- ✅ Implement request logging
- ✅ Use environment-specific configurations

### 2. **Monitoring & Logging**

- ✅ Monitor failed authentication attempts
- ✅ Log rate limit violations
- ✅ Track suspicious API usage patterns
- ✅ Monitor database query performance
- ✅ Set up alerting for security events

### 3. **Regular Security Updates**

- ✅ Keep dependencies updated
- ✅ Monitor security advisories
- ✅ Regular security audits
- ✅ Penetration testing
- ✅ Security training for developers

## 📚 Additional Resources

- [NestJS Security Documentation](https://docs.nestjs.com/security/authentication)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OWASP Security Guidelines](https://owasp.org/www-project-api-security/)
- [Argon2 Password Hashing](https://argon2.online/)

## 🆘 Troubleshooting

### Common Issues

1. **JWT Secret Error**: Ensure `JWT_SECRET` is set and at least 32 characters
2. **Rate Limiting**: Check if you're hitting rate limits during development
3. **CORS Issues**: Verify `CORS_ORIGIN` configuration
4. **Database Connection**: Ensure MongoDB is running and accessible

### Support

If you encounter issues:

1. Check the logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check database connectivity
5. Review the security configuration

---

**⚠️ Security Notice**: This configuration provides a strong security foundation, but security is an ongoing process. Regularly review and update your security measures based on your specific requirements and threat landscape.
