import { Module } from '@nestjs/common';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, CloudinaryService],
  exports: [UploadService],
})
export class UploadModule {}
