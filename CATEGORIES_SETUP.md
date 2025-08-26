# Categories Setup Guide

This guide explains how to set up and manage product categories in the Cosmic API.

## Overview

The categories system provides a way to organize products into logical groups. Each category can have:

- A unique name
- An optional description
- An optional image URL
- Product count tracking

## Database Schema

Categories are stored in the `Category` table with the following structure:

```prisma
model Category {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  description String?
  image       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  products    Product[]
}
```

## Default Categories

The system comes with 10 pre-configured categories:

1. **Smartphones** - Mobile phones and smartphones with advanced features
2. **Laptops & Computers** - Desktop computers, laptops, and computing devices
3. **Smartwatches** - Wearable technology and smartwatches
4. **Cameras & Photography** - Digital cameras, lenses, and photography equipment
5. **Audio & Headphones** - Headphones, speakers, and audio equipment
6. **Gaming & Consoles** - Gaming consoles, accessories, and gaming equipment
7. **Tablets & E-readers** - Tablets, e-readers, and portable computing devices
8. **Home & Smart Devices** - Smart home devices, IoT products, and home automation
9. **Accessories & Peripherals** - Computer accessories, cables, and peripheral devices
10. **Wearable Technology** - Fitness trackers, VR headsets, and wearable devices

## Setup Instructions

### 1. Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

### 2. Database Setup

Ensure your database is running and the Prisma schema is up to date:

```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Categories

Run the seeding script to populate the database with default categories:

```bash
npm run seed:categories
```

This will create all 10 default categories if they don't already exist.

## API Endpoints

### Public Endpoints (No Authentication Required)

#### GET /categories

Retrieve all categories with product counts.

```bash
curl http://localhost:8000/categories
```

#### GET /categories/:id

Retrieve a specific category by ID.

```bash
curl http://localhost:8000/categories/[category-id]
```

### Admin-Only Endpoints (Require Authentication)

#### POST /categories

Create a new category.

```bash
curl -X POST http://localhost:8000/categories \
  -H "Authorization: Bearer [your-jwt-token]" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Category",
    "description": "Category description",
    "image": "https://example.com/image.jpg"
  }'
```

#### PATCH /categories/:id

Update an existing category.

```bash
curl -X PATCH http://localhost:8000/categories/[category-id] \
  -H "Authorization: Bearer [your-jwt-token]" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```

#### DELETE /categories/:id

Delete a category (only if it has no products).

```bash
curl -X DELETE http://localhost:8000/categories/[category-id] \
  -H "Authorization: Bearer [your-jwt-token]"
```

#### POST /categories/seed

Re-run the category seeding process.

```bash
curl -X POST http://localhost:8000/categories/seed \
  -H "Authorization: Bearer [your-jwt-token]"
```

## Frontend Integration

The frontend has been updated to automatically fetch categories from the API instead of using hardcoded data. The Categories component will:

1. Fetch categories from `/categories` endpoint
2. Display loading state while fetching
3. Show error state if fetching fails
4. Display categories with icons, names, descriptions, and product counts
5. Use emoji icons mapped to category names

## Category Management

### Adding New Categories

1. Use the admin API endpoint to create new categories
2. Ensure category names are unique
3. Provide meaningful descriptions and images

### Updating Categories

1. Use the PATCH endpoint to modify existing categories
2. Category names can be updated but must remain unique
3. All fields are optional during updates

### Deleting Categories

1. Categories can only be deleted if they have no associated products
2. Use the DELETE endpoint with admin authentication
3. Consider updating products to use a different category before deletion

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Insufficient permissions (admin required)
- **404 Not Found** - Category doesn't exist
- **409 Conflict** - Category name already exists or cannot be deleted

## Rate Limiting

Public endpoints are protected with moderate rate limiting to prevent abuse.

## Security

- Category creation, updates, and deletion require admin authentication
- JWT tokens are validated for all protected endpoints
- Input validation ensures data integrity

## Troubleshooting

### Common Issues

1. **"Category not found" errors**

   - Ensure the category ID is correct
   - Check if the category was deleted

2. **"Category name already exists" errors**

   - Use a unique name for new categories
   - Check existing categories first

3. **"Cannot delete category with products" errors**

   - Move or delete all products in the category first
   - Update products to use a different category

4. **Authentication errors**
   - Ensure you have a valid JWT token
   - Verify you have admin privileges

### Database Issues

If you encounter database-related issues:

1. Check your database connection
2. Verify Prisma schema is up to date
3. Run `npx prisma db push` to sync schema
4. Check database logs for errors

## Support

For additional support or questions about the categories system, please refer to the main project documentation or contact the development team.
