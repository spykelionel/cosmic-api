import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

export interface CloudinaryUploadOptions {
  folder?: string;
  tags?: string[];
  transformation?: Record<string, any>;
  resource_type?: 'image' | 'video' | 'raw';
  allowed_formats?: string[];
  quality?: string | number;
  format?: string;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
  tags: string[];
  folder: string;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    // Configuration is handled by the cloudinary.config.ts file
    // This service will use the global configuration
  }

  async uploadImage(
    filePath: string,
    options: CloudinaryUploadOptions = {},
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'misc',
        tags: options.tags || [],
        transformation: options.transformation || {},
        resource_type: options.resource_type || 'image',
        allowed_formats: options.allowed_formats || [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'webp',
        ],
        quality: options.quality || 'auto',
        format: options.format || 'auto',
      };

      this.logger.log(`Uploading image to Cloudinary: ${filePath}`);
      this.logger.log(`Upload options: ${JSON.stringify(uploadOptions)}`);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, uploadOptions, (error, result) => {
          if (error) {
            this.logger.error(`Cloudinary upload failed: ${error.message}`);
            reject(new Error(`Upload failed: ${error.message}`));
            return;
          }

          this.logger.log(`Image uploaded successfully: ${result.public_id}`);
          resolve(result as unknown as CloudinaryUploadResult);
        });
      });
    } catch (error) {
      this.logger.error(`Upload service error: ${error.message}`);
      throw new Error(`Upload service error: ${error.message}`);
    }
  }

  async uploadImageBuffer(
    buffer: Buffer,
    options: CloudinaryUploadOptions = {},
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'misc',
        tags: options.tags || [],
        transformation: options.transformation || {},
        resource_type: options.resource_type || 'image',
        allowed_formats: options.allowed_formats || [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'webp',
        ],
        quality: options.quality || 'auto',
        format: options.format || 'auto',
      };

      this.logger.log(`Uploading image buffer to Cloudinary`);
      this.logger.log(`Upload options: ${JSON.stringify(uploadOptions)}`);

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(uploadOptions, (error, result) => {
            if (error) {
              this.logger.error(`Cloudinary upload failed: ${error.message}`);
              reject(new Error(`Upload failed: ${error.message}`));
              return;
            }

            this.logger.log(`Image uploaded successfully: ${result.public_id}`);
            resolve(result as unknown as CloudinaryUploadResult);
          })
          .end(buffer);
      });
    } catch (error) {
      this.logger.error(`Upload service error: ${error.message}`);
      throw new Error(`Upload service error: ${error.message}`);
    }
  }

  async deleteImage(
    publicId: string,
  ): Promise<{ success: boolean; message: string; result: any }> {
    try {
      this.logger.log(`Deleting image from Cloudinary: ${publicId}`);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            this.logger.error(`Cloudinary delete failed: ${error.message}`);
            reject(new Error(`Delete failed: ${error.message}`));
            return;
          }

          this.logger.log(`Image deleted successfully: ${publicId}`);
          resolve({
            success: true,
            message: 'Image deleted successfully',
            result,
          });
        });
      });
    } catch (error) {
      this.logger.error(`Delete service error: ${error.message}`);
      throw new Error(`Delete service error: ${error.message}`);
    }
  }

  async deleteMultipleImages(publicIds: string[]): Promise<{
    success: boolean;
    total: number;
    successful: number;
    failed: number;
    results: Array<{ publicId: string; success: boolean; message: string }>;
  }> {
    try {
      this.logger.log(
        `Deleting multiple images from Cloudinary: ${publicIds.length} images`,
      );

      const deletePromises = publicIds.map(async (publicId) => {
        try {
          const result = await this.deleteImage(publicId);
          return { publicId, success: true, message: result.message };
        } catch (error) {
          return { publicId, success: false, message: error.message };
        }
      });

      const results = await Promise.all(deletePromises);
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      this.logger.log(
        `Multiple delete completed: ${successful} successful, ${failed} failed`,
      );

      return {
        success: true,
        total: publicIds.length,
        successful,
        failed,
        results,
      };
    } catch (error) {
      this.logger.error(`Multiple delete service error: ${error.message}`);
      throw new Error(`Multiple delete service error: ${error.message}`);
    }
  }

  async getImageInfo(publicId: string): Promise<any> {
    try {
      this.logger.log(`Getting image info from Cloudinary: ${publicId}`);

      return new Promise((resolve, reject) => {
        cloudinary.api.resource(publicId, (error, result) => {
          if (error) {
            this.logger.error(`Cloudinary get info failed: ${error.message}`);
            reject(new Error(`Get info failed: ${error.message}`));
            return;
          }

          this.logger.log(`Image info retrieved successfully: ${publicId}`);
          resolve(result);
        });
      });
    } catch (error) {
      this.logger.error(`Get info service error: ${error.message}`);
      throw new Error(`Get info service error: ${error.message}`);
    }
  }

  async updateImageTransformation(
    publicId: string,
    transformation: Record<string, any>,
  ): Promise<any> {
    try {
      this.logger.log(`Updating image transformation: ${publicId}`);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.explicit(
          publicId,
          {
            type: 'upload',
            transformation: transformation,
          },
          (error, result) => {
            if (error) {
              this.logger.error(
                `Cloudinary transformation update failed: ${error.message}`,
              );
              reject(
                new Error(`Transformation update failed: ${error.message}`),
              );
              return;
            }

            this.logger.log(
              `Image transformation updated successfully: ${publicId}`,
            );
            resolve(result);
          },
        );
      });
    } catch (error) {
      this.logger.error(
        `Transformation update service error: ${error.message}`,
      );
      throw new Error(`Transformation update service error: ${error.message}`);
    }
  }

  async addImageTags(publicId: string, tags: string): Promise<any> {
    try {
      this.logger.log(`Adding tags to image: ${publicId}, tags: ${tags}`);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.add_tag(tags, [publicId], (error, result) => {
          if (error) {
            this.logger.error(
              `Cloudinary tag addition failed: ${error.message}`,
            );
            reject(new Error(`Tag addition failed: ${error.message}`));
            return;
          }

          this.logger.log(`Tags added successfully to: ${publicId}`);
          resolve(result);
        });
      });
    } catch (error) {
      this.logger.error(`Tag addition service error: ${error.message}`);
      throw new Error(`Tag addition service error: ${error.message}`);
    }
  }

  async removeImageTags(publicId: string, tags: string): Promise<any> {
    try {
      this.logger.log(`Removing tags from image: ${publicId}, tags: ${tags}`);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.remove_tag(tags, [publicId], (error, result) => {
          if (error) {
            this.logger.error(
              `Cloudinary tag removal failed: ${error.message}`,
            );
            reject(new Error(`Tag removal failed: ${error.message}`));
            return;
          }

          this.logger.log(`Tags removed successfully from: ${publicId}`);
          resolve(result);
        });
      });
    } catch (error) {
      this.logger.error(`Tag removal service error: ${error.message}`);
      throw new Error(`Tag removal service error: ${error.message}`);
    }
  }

  generateImageUrl(
    publicId: string,
    transformation?: Record<string, any>,
  ): string {
    try {
      if (transformation) {
        return cloudinary.url(publicId, { transformation: [transformation] });
      }
      return cloudinary.url(publicId);
    } catch (error) {
      this.logger.error(`URL generation error: ${error.message}`);
      throw new Error(`URL generation error: ${error.message}`);
    }
  }
}
