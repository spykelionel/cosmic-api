import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export enum FileType {
  PRODUCT_IMAGE = 'PRODUCT_IMAGE',
  CATEGORY_IMAGE = 'CATEGORY_IMAGE',
  USER_AVATAR = 'USER_AVATAR',
  BANNER_IMAGE = 'BANNER_IMAGE',
}

export class UploadFileDto {
  @ApiProperty({
    description: 'File type for categorization',
    enum: FileType,
    example: FileType.PRODUCT_IMAGE,
  })
  @IsEnum(FileType)
  fileType: FileType;

  @ApiProperty({
    description: 'Folder path in Cloudinary (optional)',
    required: false,
    example: 'products/electronics',
  })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiProperty({
    description: 'Additional tags for the uploaded file',
    required: false,
    example: ['electronics', 'gadgets'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Transformation options for the image',
    required: false,
    example: { width: 800, height: 600, crop: 'fill' },
  })
  @IsOptional()
  transformation?: Record<string, any>;
}

export class UploadMultipleFilesDto {
  @ApiProperty({
    description: 'File type for categorization',
    enum: FileType,
    example: FileType.PRODUCT_IMAGE,
  })
  @IsEnum(FileType)
  fileType: FileType;

  @ApiProperty({
    description: 'Folder path in Cloudinary (optional)',
    required: false,
    example: 'products/electronics',
  })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiProperty({
    description: 'Additional tags for the uploaded files',
    required: false,
    example: ['electronics', 'gadgets'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Transformation options for the images',
    required: false,
    example: { width: 800, height: 600, crop: 'fill' },
  })
  @IsOptional()
  transformation?: Record<string, any>;
}

export class DeleteFileDto {
  @ApiProperty({
    description: 'Cloudinary public ID of the file to delete',
    example: 'products/electronics/product_123',
  })
  @IsString()
  publicId: string;
}
