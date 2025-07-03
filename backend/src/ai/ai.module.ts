import { Module } from '@nestjs/common';
import { AIClassifierService } from './ai-classifier.service';

@Module({
  providers: [AIClassifierService],
  exports: [AIClassifierService],
})
export class AIModule {}
