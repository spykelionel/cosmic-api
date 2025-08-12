# E-commerce API Endpoints Documentation

This document outlines all the implemented API endpoints for the Cosmic E-commerce application.

## Authentication APIs

- `POST /auth/register` – User registration
- `POST /auth/login` – User login
- `POST /auth/logout` – User logout
- `POST /auth/refresh-token` – Refresh access token
- `POST /auth/forgot-password` – Request password reset
- `POST /auth/reset-password` – Reset password with token

## Product APIs

- `GET /products` – Get all products (with filtering/sorting)
- `GET /products/:id` – Get single product details
- `POST /products` – Create new product (admin/vendor)
- `PUT /products/:id` – Update product (admin/vendor)
- `DELETE /products/:id` – Delete product (admin/vendor)
- `GET /products/categories` – Get all product categories
- `GET /products/category/:categoryId` – Get products by category
- `GET /products/filters` – Get available filters
- `POST /products/filter` – Filter products
- `GET /search` – Search products
- `GET /vendor/products` – Get vendor's products

## Cart APIs

- `GET /cart` – Get user's cart
- `POST /cart` – Add item to cart
- `PUT /cart/:itemId` – Update cart item quantity
- `DELETE /cart/:itemId` – Remove item from cart
- `DELETE /cart` – Clear cart

## Order APIs

- `POST /orders` – Create new order
- `GET /orders` – Get user's order history
- `GET /orders/:orderId` – Get order details
- `PUT /orders/:orderId/cancel` – Cancel order
- `GET /vendor/orders` – Get vendor's orders
- `PUT /vendor/orders/:orderId/status` – Update order status
- `GET /vendor/stats` – Get vendor dashboard statistics

## User Profile APIs

- `GET /users/me` – Get current user profile
- `PUT /users/me` – Update user profile
- `PUT /users/password` – Change password
- `GET /users/addresses` – Get user addresses
- `POST /users/addresses` – Add new address
- `PUT /users/addresses/:addressId` – Update address
- `DELETE /users/addresses/:addressId` – Remove address
- `PUT /users/addresses/:addressId/default` – Set address as default

## Review & Rating APIs

- `POST /products/:id/reviews` – Add review to product
- `GET /products/:id/reviews` – Get product reviews
- `POST /reviews/products/:productId` – Add review to product (alternative route)
- `GET /reviews/products/:productId` – Get product reviews (alternative route)
- `PUT /reviews/:reviewId` – Update review
- `DELETE /reviews/:reviewId` – Delete review
- `GET /reviews/user/me` – Get current user reviews
- `GET /reviews/vendor/products` – Get vendor product reviews

## Wishlist APIs

- `GET /wishlist` – Get user's wishlist
- `POST /wishlist` – Add to wishlist
- `DELETE /wishlist/:productId` – Remove from wishlist
- `DELETE /wishlist` – Clear wishlist
- `GET /wishlist/count` – Get wishlist item count
- `POST /wishlist/:productId/move-to-cart` – Move product from wishlist to cart
- `GET /wishlist/:productId/check` – Check if product is in wishlist

## Admin APIs

- `GET /admin/users` – Get all users (admin only)
- `GET /admin/users/:userId` – Get user details by ID (admin only)
- `PUT /admin/users/:userId/role` – Update user role (admin only)
- `PUT /admin/users/:userId/status` – Update user status (admin only)
- `GET /admin/stats` – Get admin dashboard statistics
- `GET /admin/orders` – Get all orders (admin only)
- `GET /admin/health` – Get system health status

## Payment APIs

- `POST /payment/create-intent` – Create payment intent
- `POST /payment/webhook` – Payment webhook handler
- `GET /payment/methods` – Get available payment methods
- `GET /payment/history` – Get payment history
- `POST /payment/process/:paymentIntentId` – Process payment with payment method
- `POST /payment/refund/:paymentId` – Refund payment

## File Upload APIs (Cloudinary)

- `POST /upload/single` – Upload single file
- `POST /upload/multiple` – Upload multiple files (max 10)
- `POST /upload/product-images` – Upload product images (max 5)
- `DELETE /upload/file` – Delete single file
- `DELETE /upload/files` – Delete multiple files
- `GET /upload/file/:publicId` – Get file information
- `GET /upload/signed-url/:publicId` – Generate signed URL for file

## Module Structure

The application follows a modular architecture with the following structure:

```
src/modules/
├── auth/           # Authentication & authorization
├── products/       # Product management
├── cart/          # Shopping cart functionality
├── orders/        # Order management
├── users/         # User profile & address management
├── reviews/       # Product reviews & ratings
├── wishlist/      # User wishlist management
├── admin/         # Admin operations & statistics
├── payment/       # Payment processing
└── upload/        # File upload (Cloudinary)
```

## Database Models

The application uses Prisma ORM with MongoDB and includes the following models:

- `User` - User accounts with vendor/admin roles
- `Category` - Product categories
- `Product` - Products with images, pricing, and inventory
- `CartItem` - Shopping cart items
- `Order` - Customer orders with status tracking
- `OrderItem` - Individual items within orders
- `Address` - User shipping/billing addresses
- `Review` - Product reviews and ratings
- `WishlistItem` - User wishlist items
- `Payment` - Payment records and status

## Authentication & Authorization

- JWT-based authentication using `JwtAuthGuard`
- Role-based access control (User, Vendor, Admin)
- Protected routes require valid JWT tokens
- Admin routes require admin privileges

## File Upload Features

- Cloudinary integration for image storage
- Support for multiple image formats (JPG, PNG, GIF, WebP)
- Automatic image optimization and transformation
- Organized folder structure by file type
- File size validation (5MB limit per file)
- Secure signed URLs for private access

## Search & Filtering

- Product search with text queries
- Category-based filtering
- Price range filtering
- Rating filtering
- Pagination support
- Sorting options (price, rating, date)

## Payment Integration

- Payment intent creation
- Multiple payment method support
- Webhook handling for payment status updates
- Refund processing
- Payment history tracking

## Swagger Documentation

All APIs are documented using Swagger/OpenAPI with:

- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Error code documentation

## Environment Configuration

The application requires the following environment variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/cosmic"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Run database migrations: `npx prisma migrate dev`
4. Start the application: `npm run start:dev`
5. Access Swagger documentation: `http://localhost:3000/api`

## Testing

The application includes comprehensive test coverage:

- Unit tests for services
- Integration tests for controllers
- E2E tests for complete workflows

Run tests with:

- `npm run test` - Unit tests
- `npm run test:e2e` - E2E tests
- `npm run test:cov` - Coverage report
