/* eslint-disable prettier/prettier */
// sales/sales.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SupabaseAuthGuard } from 'src/common/guards/supabase.guard'; ;
import { User } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/common/types/user-role.type';
import { Roles } from 'src/common/decorators/role.decorator';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';


@ApiTags('VTU')
@ApiBearerAuth('access-token')
@Controller('sales')
@UseGuards(SupabaseAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create a new sale record' })
  @ApiResponse({ status: 201, description: 'Sale record created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ type: CreateSaleDto, description: 'Data for creating a new sale record' })
  @Post()
  async create(@User() user: any, @Body() dto: CreateSaleDto): Promise<SaleTrackApiResponse<any>> {
    const result = await this.salesService.createSales(user, dto);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create multiple sale records in bulk' })
  @ApiResponse({ status: 201, description: 'Bulk sale records created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ type: [CreateSaleDto], description: 'Array of data for creating new sale records' })
  @Post('bulk')
  async createBulk(@User() user: any, @Body() dtos: CreateSaleDto[]): Promise<SaleTrackApiResponse<{ insertedRecords: number }>> {
    const result = await this.salesService.createBulkSales(user, dtos);
    return result;
  }

  async getSales()

  
}
