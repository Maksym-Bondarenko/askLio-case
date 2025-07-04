import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestModule } from './request/request.module';
import { ProcurementRequest } from './request/entities/request.entity';
import { OrderLine } from './request/entities/order-line.entity';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [ProcurementRequest, OrderLine],
      synchronize: true,
    }),
    AIModule,
    RequestModule,
    FileUploadModule,
  ],
})
export class AppModule {}
