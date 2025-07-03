import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcurementRequest } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestService {

    // temporally, TODO: remove this after testing
    async seed() {
        const sample = this.requestRepo.create({
          requestorName: 'Max',
          title: 'Adobe CC',
          vendorName: 'Adobe',
          vatId: 'DE123456',
          department: 'Marketing',
          totalCost: 500,
          status: 'Open',
        });
        return await this.requestRepo.save(sample);
      }
      

  constructor(
    @InjectRepository(ProcurementRequest)
    private readonly requestRepo: Repository<ProcurementRequest>,
  ) {}

  findAll(): Promise<ProcurementRequest[]> {
    return this.requestRepo.find();
  }

  async updateStatus(id: number, status: string): Promise<ProcurementRequest> {
    const request = await this.requestRepo.findOneBy({ id });

    if (!request) {
      throw new NotFoundException(`Request with id ${id} not found`);
    }

    request.status = status;
    return this.requestRepo.save(request);
  }

  async create(dto: CreateRequestDto) {
    const request = this.requestRepo.create({
      ...dto,
      orderLines: dto.orderLines,
    });
    return this.requestRepo.save(request);
  }
  
}
