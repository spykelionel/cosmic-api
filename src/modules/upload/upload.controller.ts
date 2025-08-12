import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { DeleteFileDto, UploadFileDto, UploadMultipleFilesDto } from './dto';
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

  @Get('file/:publicId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get file information' })
  @ApiParam({ name: 'publicId', description: 'Cloudinary public ID' })
  @ApiResponse({
    status: 200,
    description: 'File information retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFileInfo(@Param('publicId') publicId: string) {
    return this.uploadService.getFileInfo(publicId);
  }

  @Get('signed-url/:publicId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate signed URL for file' })
  @ApiParam({ name: 'publicId', description: 'Cloudinary public ID' })
  @ApiQuery({
    name: 'transformation',
    required: false,
    description: 'Image transformation options (JSON string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Signed URL generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateSignedUrl(
    @Param('publicId') publicId: string,
    @Query('transformation') transformation?: string,
  ) {
    const transformationObj = transformation
      ? JSON.parse(transformation)
      : undefined;
    return this.uploadService.generateSignedUrl(publicId, transformationObj);
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
    @Body() body: { productId: string; tags?: string[] },
  ) {
    const uploadDto: UploadMultipleFilesDto = {
      fileType: 'PRODUCT_IMAGE' as any,
      folder: `products/${body.productId}`,
      tags: body.tags || [],
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
}
