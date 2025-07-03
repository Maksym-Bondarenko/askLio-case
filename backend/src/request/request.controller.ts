import { Controller, Get, Param, Patch, Body, Post } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Controller('api/requests')
export class RequestController {
  constructor(private readonly service: RequestService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('status') status: string) {
    return this.service.updateStatus(Number(id), status);
  }

  @Post()
  create(@Body() dto: CreateRequestDto) {
    return this.service.create(dto);
  }
}
