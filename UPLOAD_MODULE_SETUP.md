# Upload Module Setup Guide

This guide explains how to set up and use the upload module with Cloudinary integration in the Cosmic API.

## Overview

The upload module provides comprehensive file upload capabilities with Cloudinary integration. It supports:

- Single and multiple file uploads
- Image transformations and optimizations
- File categorization and organization
- Tag management
- Secure file deletion
- Specialized endpoints for different file types

## Prerequisites

### 1. Cloudinary Account

- Sign up at [cloudinary.com](https://cloudinary.com)
- Get your cloud name, API key, and API secret

### 2. Environment Variables

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Dependencies

Ensure these packages are installed:

```bash
npm install cloudinary multer @types/multer
```

## Configuration

### Cloudinary Configuration

The module uses a centralized Cloudinary configuration in `src/core/config/cloudinary.config.ts`:

```typescript
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = (configService: ConfigService) => {
  cloudinary.config({
    cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
  });
};
```

### Multer Configuration

File upload handling is configured with proper validation:

- Maximum file size: 5MB
- Allowed formats: jpg, jpeg, png, gif, webp
- File type validation
- Size validation

## API Endpoints

### Authentication

All upload endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### 1. Single File Upload

**POST** `/upload/single`

Upload a single file with metadata.

**Form Data:**

- `file`: The file to upload (required)
- `fileType`: Type of file (required)
- `folder`: Custom folder path (optional)
- `tags`: Array of tags (optional)
- `transformation`: Image transformation options (optional)

**File Types:**

- `PRODUCT_IMAGE`: Product images (800x800, fill crop)
- `CATEGORY_IMAGE`: Category images (400x400, fill crop)
- `USER_AVATAR`: User avatars (200x200, face crop)
- `BANNER_IMAGE`: Banner images (1200x400, fill crop)

**Example:**

```bash
curl -X POST http://localhost:8000/upload/single \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg" \
  -F "fileType=PRODUCT_IMAGE" \
  -F "folder=products/electronics" \
  -F "tags=electronics,gadgets"
```

### 2. Multiple Files Upload

**POST** `/upload/multiple`

Upload up to 10 files simultaneously.

**Form Data:**

- `files`: Array of files (required, max 10)
- `fileType`: Type of files (required)
- `folder`: Custom folder path (optional)
- `tags`: Array of tags (optional)
- `transformation`: Image transformation options (optional)

**Example:**

```bash
curl -X POST http://localhost:8000/upload/multiple \
  -H "Authorization: Bearer <token>" \
  -F "files[]=@image1.jpg" \
  -F "files[]=@image2.jpg" \
  -F "fileType=PRODUCT_IMAGE" \
  -F "folder=products/electronics"
```

### 3. Specialized Endpoints

#### Product Images

**POST** `/upload/product-images`

Optimized for product image uploads with automatic organization.

**Form Data:**

- `images`: Array of images (required, max 5)
- `productId`: Product ID for organization (required)
- `tags`: Array of tags (optional)

#### Category Images

**POST** `/upload/category-images`

Optimized for category image uploads.

**Form Data:**

- `image`: Single image (required)
- `categoryId`: Category ID for organization (required)
- `tags`: Array of tags (optional)

#### User Avatars

**POST** `/upload/user-avatar`

Optimized for user avatar uploads with face detection.

**Form Data:**

- `avatar`: Single image (required)
- `userId`: User ID for organization (required)
- `tags`: Array of tags (optional)

### 4. File Management

#### Get File Information

**GET** `/upload/file/:publicId`

Retrieve detailed information about a file.

#### Update File Transformation

**PATCH** `/upload/file/:publicId/transformation`

Update image transformation options.

**Body:**

```json
{
  "transformation": {
    "width": 800,
    "height": 600,
    "crop": "fill",
    "quality": "auto"
  }
}
```

#### Add Tags

**POST** `/upload/file/:publicId/tags`

Add tags to a file.

**Body:**

```json
{
  "tags": "electronics,gadgets"
}
```

#### Remove Tags

**DELETE** `/upload/file/:publicId/tags`

Remove tags from a file.

**Body:**

```json
{
  "tags": "electronics,gadgets"
}
```

#### Generate URL

**GET** `/upload/file/:publicId/url`

Generate a file URL with optional transformation.

**Body (optional):**

```json
{
  "transformation": {
    "width": 400,
    "height": 400,
    "crop": "fill"
  }
}
```

### 5. File Deletion

#### Delete Single File

**DELETE** `/upload/file`

Delete a single file by public ID.

**Body:**

```json
{
  "publicId": "products/electronics/image_123"
}
```

#### Delete Multiple Files

**DELETE** `/upload/files`

Delete multiple files by public IDs.

**Body:**

```json
{
  "publicIds": [
    "products/electronics/image_123",
    "products/electronics/image_456"
  ]
}
```

## File Organization

### Folder Structure

Files are automatically organized in Cloudinary based on file type and context:

```
cloudinary/
├── products/
│   ├── product_id_1/
│   └── product_id_2/
├── categories/
│   ├── category_id_1/
│   └── category_id_2/
├── users/
│   └── avatars/
│       ├── user_id_1/
│       └── user_id_2/
└── banners/
```

### Default Transformations

Each file type has optimized default transformations:

- **Product Images**: 800x800, fill crop, auto quality
- **Category Images**: 400x400, fill crop, auto quality
- **User Avatars**: 200x200, fill crop, face gravity, auto quality
- **Banner Images**: 1200x400, fill crop, auto quality

## Response Format

### Successful Upload Response

```json
{
  "success": true,
  "file": {
    "publicId": "products/electronics/image_123",
    "secureUrl": "https://res.cloudinary.com/...",
    "url": "http://res.cloudinary.com/...",
    "width": 800,
    "height": 800,
    "format": "jpg",
    "size": 245760,
    "folder": "products/electronics",
    "tags": "electronics,gadgets",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "File uploaded successfully"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Upload failed: Invalid file type",
  "error": "Bad Request"
}
```

## Security Features

### File Validation

- File type validation (images only)
- File size limits (5MB max)
- MIME type checking
- Secure file handling

### Authentication

- JWT token required for all endpoints
- User authorization enforced
- Secure file access control

### File Cleanup

- Automatic temporary file cleanup
- Error handling with cleanup
- Secure file deletion from Cloudinary

## Error Handling

### Common Error Codes

- **400 Bad Request**: Invalid file, size, or type
- **401 Unauthorized**: Missing or invalid JWT token
- **413 Payload Too Large**: File exceeds size limit
- **415 Unsupported Media Type**: Invalid file format

### Error Logging

All operations are logged with:

- Operation type and details
- File information
- Error details
- Success/failure status

## Performance Optimization

### Cloudinary Features

- Automatic image optimization
- Format conversion (WebP, AVIF)
- Quality optimization
- Responsive images
- CDN delivery

### Upload Optimization

- Parallel file processing
- Efficient memory usage
- Automatic cleanup
- Error recovery

## Monitoring and Logging

### Log Levels

- **INFO**: Successful operations
- **WARN**: Non-critical issues
- **ERROR**: Failed operations

### Metrics

- Upload success/failure rates
- File size distribution
- Processing times
- Storage usage

## Troubleshooting

### Common Issues

1. **"Invalid file type" errors**

   - Ensure file is an image (jpg, jpeg, png, gif, webp)
   - Check file extension and MIME type

2. **"File size too large" errors**

   - Reduce file size to under 5MB
   - Use image compression if needed

3. **"Cloudinary upload failed" errors**

   - Check environment variables
   - Verify Cloudinary account status
   - Check network connectivity

4. **"Authentication failed" errors**
   - Ensure JWT token is valid
   - Check token expiration
   - Verify user permissions

### Debug Mode

Enable debug logging by setting log level to DEBUG in your environment.

## Best Practices

### File Management

- Use appropriate file types for different purposes
- Implement proper error handling
- Clean up unused files regularly
- Monitor storage usage

### Security

- Validate all file uploads
- Implement file size limits
- Use secure authentication
- Monitor for abuse

### Performance

- Use appropriate image sizes
- Implement caching strategies
- Optimize transformation parameters
- Monitor upload performance

## Support

For additional support or questions about the upload module:

- Check the API documentation at `/swagger`
- Review Cloudinary documentation
- Contact the development team
- Check application logs for detailed error information
