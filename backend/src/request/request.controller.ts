import { Controller, Get, Param, Patch, Body, Post } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('api/requests')
export class RequestController {
  constructor(private readonly service: RequestService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(+id, dto.status);
    }

  @Post()
  create(@Body() dto: CreateRequestDto) {
    return this.service.create(dto);
  }
}
