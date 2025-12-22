/* eslint-disable prettier/prettier */
// sales/dto/create-sale.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({
    description: 'The date of the sale',
    example: '2024-06-15T14:30:00Z',
  })
  @IsDateString()
  saleDate: string;

  @ApiProperty({
    description: 'The name of the item sold',
    example: 'Wireless Headphones',
  })
  @IsString()
  itemName: string;

  @ApiProperty({
    description: 'The price per item sold',
    example: 99.99,
  })
  @IsNumber()
  @Min(0)
  pricePerItem: number;

  @ApiProperty({
    description: 'The quantity of items sold',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
