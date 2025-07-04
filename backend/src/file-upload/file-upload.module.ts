import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { AIModule } from '../ai/ai.module';

@Module({
  controllers: [FileUploadController],
  imports: [AIModule],
})
export class FileUploadModule {}
