// sales/dto/create-sale.dto.ts
import { IsDateString, IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  @IsDateString()
  saleDate: string;

  @IsString()
  itemName: string;

  @IsNumber()
  @Min(0)
  pricePerItem: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
