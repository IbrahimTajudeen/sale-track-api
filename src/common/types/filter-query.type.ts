/* eslint-disable prettier/prettier */
import { IsOptional, IsNumber, } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterQuery {
  @ApiProperty({ example: 1, description: 'The current page number', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ example: 10, description: 'The number of items per page', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  /**
   * Generic filters — e.g.
   * GET /users?status=active&country=USA
   */

  [key: string]: any;
}
