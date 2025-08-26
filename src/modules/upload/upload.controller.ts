import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import {
  DeleteFileDto,
  FileType,
  UploadFileDto,
  UploadMultipleFilesDto,
} from './dto';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        fileType: {
          type: 'string',
          enum: [
            'PRODUCT_IMAGE',
            'CATEGORY_IMAGE',
            'USER_AVATAR',
            'BANNER_IMAGE',
          ],
          description: 'Type of file being uploaded',
        },
        folder: {
          type: 'string',
          description: 'Custom folder path (optional)',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags for the file (optional)',
        },
        transformation: {
          type: 'object',
          description: 'Image transformation options (optional)',
        },
      },
      required: ['file', 'fileType'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadSingleFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    return this.uploadService.uploadSingleFile(file, uploadFileDto);
  }

  @Post('multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload (max 10)',
        },
        fileType: {
          type: 'string',
          enum: [
            'PRODUCT_IMAGE',
            'CATEGORY_IMAGE',
            'USER_AVATAR',
            'BANNER_IMAGE',
          ],
          description: 'Type of files being uploaded',
        },
        folder: {
          type: 'string',
          description: 'Custom folder path (optional)',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags for the files (optional)',
        },
        transformation: {
          type: 'object',
          description: 'Image transformation options (optional)',
        },
      },
      required: ['files', 'fileType'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadMultipleFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB per file
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif|webp)' }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body() uploadMultipleFilesDto: UploadMultipleFilesDto,
  ) {
    return this.uploadService.uploadMultipleFiles(
      files,
      uploadMultipleFilesDto,
    );
  }

  @Get('file/:publicId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get file information' })
  @ApiResponse({
    status: 200,
    description: 'File information retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getFileInfo(@Param('publicId') publicId: string) {
    return this.uploadService.getFileInfo(publicId);
  }

  @Patch('file/:publicId/transformation')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update file transformation' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        transformation: {
          type: 'object',
          description: 'New transformation options',
          example: { width: 800, height: 600, crop: 'fill' },
        },
      },
      required: ['transformation'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File transformation updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async updateFileTransformation(
    @Param('publicId') publicId: string,
    @Body() body: { transformation: Record<string, any> },
  ) {
    return this.uploadService.updateFileTransformation(
      publicId,
      body.transformation,
    );
  }

  @Post('file/:publicId/tags')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add tags to file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags to add to the file',
          example: ['electronics', 'gadgets'],
        },
      },
      required: ['tags'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tags added successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async addFileTags(
    @Param('publicId') publicId: string,
    @Body() body: { tags: string },
  ) {
    return this.uploadService.addFileTags(publicId, body.tags);
  }

  @Delete('file/:publicId/tags')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove tags from file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags to remove from the file',
          example: ['electronics', 'gadgets'],
        },
      },
      required: ['tags'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tags removed successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async removeFileTags(
    @Param('publicId') publicId: string,
    @Body() body: { tags: string },
  ) {
    return this.uploadService.removeFileTags(publicId, body.tags);
  }

  @Get('file/:publicId/url')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate file URL with optional transformation' })
  @ApiResponse({
    status: 200,
    description: 'File URL generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async generateFileUrl(
    @Param('publicId') publicId: string,
    @Body() body?: { transformation?: Record<string, any> },
  ) {
    const url = this.uploadService.generateFileUrl(
      publicId,
      body?.transformation,
    );
    return {
      success: true,
      url,
      publicId,
      transformation: body?.transformation || null,
    };
  }

  @Delete('file')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete single file' })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteFile(@Body() deleteFileDto: DeleteFileDto) {
    return this.uploadService.deleteFile(deleteFileDto);
  }

  @Delete('files')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete multiple files' })
  @ApiResponse({
    status: 200,
    description: 'Files deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteMultipleFiles(@Body() body: { publicIds: string[] }) {
    return this.uploadService.deleteMultipleFiles(body.publicIds);
  }

  @Post('product-images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5)) // Max 5 product images
  @ApiOperation({ summary: 'Upload product images (specialized endpoint)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Product images to upload (max 5)',
        },
        productId: {
          type: 'string',
          description: 'Product ID for organizing images',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags for the images (optional)',
        },
      },
      required: ['images', 'productId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product images uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadProductImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB per file
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif|webp)' }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body() body: { productId: string; tags?: string },
  ) {
    const uploadDto: UploadMultipleFilesDto = {
      fileType: FileType.PRODUCT_IMAGE,
      folder: `products/${body.productId}`,
      tags: body.tags || 'product',
      transformation: {
        width: 800,
        height: 800,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
      },
    };

    return this.uploadService.uploadMultipleFiles(files, uploadDto);
  }

  @Post('category-images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload category image (specialized endpoint)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Category image to upload',
        },
        categoryId: {
          type: 'string',
          description: 'Category ID for organizing image',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags for the image (optional)',
        },
      },
      required: ['image', 'categoryId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Category image uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadCategoryImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: { categoryId: string; tags?: string },
  ) {
    const uploadDto: UploadFileDto = {
      fileType: FileType.CATEGORY_IMAGE,
      folder: `categories/${body.categoryId}`,
      tags: body.tags || 'category',
      transformation: {
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
      },
    };

    return this.uploadService.uploadSingleFile(file, uploadDto);
  }

  @Post('user-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Upload user avatar (specialized endpoint)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'User avatar to upload',
        },
        userId: {
          type: 'string',
          description: 'User ID for organizing avatar',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags for the avatar (optional)',
        },
      },
      required: ['avatar', 'userId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User avatar uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadUserAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: { userId: string; tags?: string },
  ) {
    const uploadDto: UploadFileDto = {
      fileType: FileType.USER_AVATAR,
      folder: `users/avatars/${body.userId}`,
      tags: body.tags || 'user',
      transformation: {
        width: 200,
        height: 200,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto',
        format: 'auto',
      },
    };

    return this.uploadService.uploadSingleFile(file, uploadDto);
  }
}
