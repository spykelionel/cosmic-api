import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import {
  DeleteFileDto,
  FileType,
  UploadFileDto,
  UploadMultipleFilesDto,
} from './dto';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadSingleFile(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
  ) {
    try {
      const { fileType, folder, tags, transformation } = uploadFileDto;

      // Validate file type
      if (!this.isValidFileType(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type. Only images are allowed.',
        );
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException(
          'File size too large. Maximum size is 5MB.',
        );
      }

      // Determine folder path based on file type
      const folderPath = folder || this.getDefaultFolder(fileType);

      // Prepare upload options
      const uploadOptions: any = {
        folder: folderPath,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation:
          transformation || this.getDefaultTransformation(fileType),
      };

      // Add tags if provided
      if (tags && tags.length > 0) {
        uploadOptions.tags = tags;
      }

      // Upload to Cloudinary
      const result = await this.cloudinaryService.uploadImage(file.path);

      return {
        success: true,
        file: {
          ...(result as any),
        },
        message: 'File uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    uploadMultipleFilesDto: UploadMultipleFilesDto,
  ) {
    try {
      const { fileType, folder, tags, transformation } = uploadMultipleFilesDto;

      // Validate all files
      for (const file of files) {
        if (!this.isValidFileType(file.mimetype)) {
          throw new BadRequestException(
            `Invalid file type for ${file.originalname}. Only images are allowed.`,
          );
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new BadRequestException(
            `File size too large for ${file.originalname}. Maximum size is 5MB.`,
          );
        }
      }

      // Determine folder path
      const folderPath = folder || this.getDefaultFolder(fileType);

      // Prepare upload options
      const uploadOptions: any = {
        folder: folderPath,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation:
          transformation || this.getDefaultTransformation(fileType),
      };

      if (tags && tags.length > 0) {
        uploadOptions.tags = tags;
      }

      // Upload all files
      const uploadPromises = files.map((file) =>
        this.cloudinaryService.uploadImage(file.path),
      );

      const results = await Promise.all(uploadPromises);

      const uploadedFiles = results.map((result) => ({
        ...(result as any),
      }));

      return {
        success: true,
        files: uploadedFiles,
        count: uploadedFiles.length,
        message: `${uploadedFiles.length} files uploaded successfully`,
      };
    } catch (error) {
      throw new BadRequestException(`Multiple upload failed: ${error.message}`);
    }
  }

  async deleteFile(deleteFileDto: DeleteFileDto) {
    try {
      const { publicId } = deleteFileDto;

      // Delete from Cloudinary
      return this.cloudinaryService.deleteImage(publicId);
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  async deleteMultipleFiles(publicIds: string[]) {
    try {
      // Delete multiple files from Cloudinary
      const deletePromises = publicIds.map((publicId) =>
        this.cloudinaryService.deleteImage(publicId),
      );

      const results = await Promise.allSettled(deletePromises);

      const successful = results.filter(
        (result) => result.status === 'fulfilled',
      ).length;
      const failed = results.filter(
        (result) => result.status === 'rejected',
      ).length;

      return {
        success: true,
        total: publicIds.length,
        successful,
        failed,
        message: `${successful} files deleted successfully, ${failed} failed`,
        results,
      };
    } catch (error) {
      throw new BadRequestException(`Multiple delete failed: ${error.message}`);
    }
  }

  private isValidFileType(mimetype: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return allowedTypes.includes(mimetype);
  }

  private getDefaultFolder(fileType: FileType): string {
    switch (fileType) {
      case FileType.PRODUCT_IMAGE:
        return 'products';
      case FileType.CATEGORY_IMAGE:
        return 'categories';
      case FileType.USER_AVATAR:
        return 'users/avatars';
      case FileType.BANNER_IMAGE:
        return 'banners';
      default:
        return 'misc';
    }
  }

  private getDefaultTransformation(fileType: FileType): Record<string, any> {
    switch (fileType) {
      case FileType.PRODUCT_IMAGE:
        return {
          width: 800,
          height: 800,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
        };
      case FileType.CATEGORY_IMAGE:
        return {
          width: 400,
          height: 400,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
        };
      case FileType.USER_AVATAR:
        return {
          width: 200,
          height: 200,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto',
          format: 'auto',
        };
      case FileType.BANNER_IMAGE:
        return {
          width: 1200,
          height: 400,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
        };
      default:
        return {
          quality: 'auto',
          format: 'auto',
        };
    }
  }
}
