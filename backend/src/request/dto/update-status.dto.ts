// backend/src/request/dto/update-status.dto.ts
import { IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateStatusDto {
  @Transform(({ value }) => value.trim())
  @IsIn(['Open', 'In Progress', 'Closed'])
  status: string;
}
