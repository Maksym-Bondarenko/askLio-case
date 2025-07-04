import { IsNotEmpty, IsNumber, ValidateNested, IsString, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderLineDto {
    @IsNotEmpty() @IsString() description: string;
    @Type(() => Number) @IsNumber() unitPrice: number;
    @Type(() => Number) @IsNumber() amount: number;
    @Type(() => Number) @IsNumber() totalPrice: number;
  
    @IsOptional() @IsString() unit?: string;
  
    @IsOptional() commodityGroupId?: string;
    @IsOptional() commodityGroupName?: string;
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
