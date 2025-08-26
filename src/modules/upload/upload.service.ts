import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import {
  CloudinaryService,
  CloudinaryUploadOptions,
} from '../../core/services/cloudinary.service';
import {
  DeleteFileDto,
  FileType,
  UploadFileDto,
  UploadMultipleFilesDto,
} from './dto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

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
      const uploadOptions: CloudinaryUploadOptions = {
        folder: folderPath,
        tags: tags || [],
        transformation:
          transformation || this.getDefaultTransformation(fileType),
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        quality: 'auto',
        format: 'auto',
      };

      this.logger.log(
        `Uploading single file: ${file.originalname} to folder: ${folderPath}`,
      );

      // Upload to Cloudinary
      const result = await this.cloudinaryService.uploadImage(
        file.path,
        uploadOptions,
      );

      // Clean up temporary file
      this.cleanupTempFile(file.path);

      return {
        success: true,
        file: {
          publicId: result.public_id,
          secureUrl: result.secure_url,
          url: result.url,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
          folder: result.folder,
          tags: result.tags,
          createdAt: result.created_at,
        },
        message: 'File uploaded successfully',
      };
    } catch (error) {
      this.logger.error(`Single file upload failed: ${error.message}`);
      // Clean up temporary file on error
      if (file?.path) {
        this.cleanupTempFile(file.path);
      }
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
      const uploadOptions: CloudinaryUploadOptions = {
        folder: folderPath,
        tags: tags || [],
        transformation:
          transformation || this.getDefaultTransformation(fileType),
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        quality: 'auto',
        format: 'auto',
      };

      this.logger.log(
        `Uploading ${files.length} files to folder: ${folderPath}`,
      );

      // Upload all files
      const uploadPromises = files.map(async (file) => {
        try {
          const result = await this.cloudinaryService.uploadImage(
            file.path,
            uploadOptions,
          );
          // Clean up temporary file
          this.cleanupTempFile(file.path);

          return {
            originalName: file.originalname,
            publicId: result.public_id,
            secureUrl: result.secure_url,
            url: result.url,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
            folder: result.folder,
            tags: result.tags,
            createdAt: result.created_at,
          };
        } catch (error) {
          this.logger.error(
            `Failed to upload ${file.originalname}: ${error.message}`,
          );
          // Clean up temporary file on error
          this.cleanupTempFile(file.path);
          throw error;
        }
      });

      const results = await Promise.all(uploadPromises);

      return {
        success: true,
        files: results,
        count: results.length,
        message: `${results.length} files uploaded successfully`,
      };
    } catch (error) {
      this.logger.error(`Multiple files upload failed: ${error.message}`);
      // Clean up all temporary files on error
      files.forEach((file) => this.cleanupTempFile(file.path));
      throw new BadRequestException(`Multiple upload failed: ${error.message}`);
    }
  }

  async deleteFile(deleteFileDto: DeleteFileDto) {
    try {
      const { publicId } = deleteFileDto;

      this.logger.log(`Deleting file: ${publicId}`);

      // Delete from Cloudinary
      const result = await this.cloudinaryService.deleteImage(publicId);

      return {
        success: true,
        message: result.message,
        publicId,
      };
    } catch (error) {
      this.logger.error(`File deletion failed: ${error.message}`);
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  async deleteMultipleFiles(publicIds: string[]) {
    try {
      this.logger.log(`Deleting ${publicIds.length} files`);

      // Delete multiple files from Cloudinary
      const result =
        await this.cloudinaryService.deleteMultipleImages(publicIds);

      return {
        success: true,
        total: result.total,
        successful: result.successful,
        failed: result.failed,
        message: `${result.successful} files deleted successfully, ${result.failed} failed`,
        results: result.results,
      };
    } catch (error) {
      this.logger.error(`Multiple files deletion failed: ${error.message}`);
      throw new BadRequestException(`Multiple delete failed: ${error.message}`);
    }
  }

  async getFileInfo(publicId: string) {
    try {
      this.logger.log(`Getting file info: ${publicId}`);

      const info = await this.cloudinaryService.getImageInfo(publicId);

      return {
        success: true,
        file: info,
        message: 'File info retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Get file info failed: ${error.message}`);
      throw new BadRequestException(`Get file info failed: ${error.message}`);
    }
  }

  async updateFileTransformation(
    publicId: string,
    transformation: Record<string, any>,
  ) {
    try {
      this.logger.log(`Updating file transformation: ${publicId}`);

      const result = await this.cloudinaryService.updateImageTransformation(
        publicId,
        transformation,
      );

      return {
        success: true,
        file: result,
        message: 'File transformation updated successfully',
      };
    } catch (error) {
      this.logger.error(`Update file transformation failed: ${error.message}`);
      throw new BadRequestException(
        `Update transformation failed: ${error.message}`,
      );
    }
  }

  async addFileTags(publicId: string, tags: string) {
    try {
      this.logger.log(`Adding tags to file: ${publicId}, tags: ${tags}`);

      const result = await this.cloudinaryService.addImageTags(publicId, tags);

      return {
        success: true,
        file: result,
        message: 'Tags added successfully',
      };
    } catch (error) {
      this.logger.error(`Add file tags failed: ${error.message}`);
      throw new BadRequestException(`Add tags failed: ${error.message}`);
    }
  }

  async removeFileTags(publicId: string, tags: string) {
    try {
      this.logger.log(`Removing tags from file: ${publicId}, tags: ${tags}`);

      const result = await this.cloudinaryService.removeImageTags(
        publicId,
        tags,
      );

      return {
        success: true,
        file: result,
        message: 'Tags removed successfully',
      };
    } catch (error) {
      this.logger.error(`Remove file tags failed: ${error.message}`);
      throw new BadRequestException(`Remove tags failed: ${error.message}`);
    }
  }

  generateFileUrl(publicId: string, transformation?: Record<string, any>) {
    try {
      return this.cloudinaryService.generateImageUrl(publicId, transformation);
    } catch (error) {
      this.logger.error(`Generate file URL failed: ${error.message}`);
      throw new BadRequestException(`Generate URL failed: ${error.message}`);
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

  private cleanupTempFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Temporary file cleaned up: ${filePath}`);
      }
    } catch (error) {
      this.logger.warn(
        `Failed to cleanup temporary file: ${filePath}`,
        error.message,
      );
    }
  }
}
