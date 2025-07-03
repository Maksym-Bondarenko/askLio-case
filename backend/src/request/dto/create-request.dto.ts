export class CreateOrderLineDto {
    description: string;
    unitPrice: number;
    amount: number;
    unit: string;
    totalPrice: number;
  }
  
  export class CreateRequestDto {
    requestorName: string;
    title: string;
    vendorName: string;
    vatId: string;
    department: string;
    totalCost: number;
    orderLines: CreateOrderLineDto[];
  }
  