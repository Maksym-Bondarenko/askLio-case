import { IsNotEmpty, IsNumber, ValidateNested, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderLineDto {
  @IsNotEmpty() @IsString() description: string;
  @IsNumber() unitPrice: number;
  @IsNumber() amount: number;
  @IsNumber() totalPrice: number;
  unit?: string;
  commodityGroupId?: string;
  commodityGroupName?: string;
}

export class CreateRequestDto {
  @IsNotEmpty() requestorName: string;
  @IsNotEmpty() title: string;
  @IsNotEmpty() vendorName: string;
  @IsNotEmpty() vatId: string;
  @IsNotEmpty() department: string;
  @IsNumber() totalCost: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderLineDto)
  @IsArray()
  orderLines: CreateOrderLineDto[];
}
