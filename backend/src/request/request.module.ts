import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { ProcurementRequest } from './entities/request.entity';
import { OrderLine } from './entities/order-line.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProcurementRequest, OrderLine])],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
