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
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SupabaseAuthGuard } from 'src/common/guards/supabase.guard'; ;
import { User } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/common/types/user-role.type';
import { Roles } from 'src/common/decorators/role.decorator';
import { SaleTrackApiResponse, SaleTrackApiPaginatedResponse } from 'src/common/utils/index.utils';
import { FilterQuery } from 'src/common/types/filter-query.type';


@ApiTags('VTU')
@ApiBearerAuth('access-token')
@Controller('sales')
@UseGuards(SupabaseAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create a new sale record' })
  @ApiResponse({ type: SaleTrackApiResponse<any>, status: 201, description: 'Sale record created successfully' })
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
  @ApiResponse({ type: SaleTrackApiResponse<{ insertedRecords: number }>, status: 201, description: 'Bulk sale records created successfully' })
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

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BOSS)
  @ApiOperation({ summary: 'Retrieve sales records with optional filtering' })
  @ApiResponse({ type: SaleTrackApiPaginatedResponse<any>, status: 200, description: 'Sales records retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({ type: FilterQuery, description: 'Filtering and pagination parameters' })
  @Get()
  async getSales(@Query() filterQuery: FilterQuery, @User() user: any): Promise<SaleTrackApiPaginatedResponse<any>> {
    // Implementation for retrieving sales records
    const result = await this.salesService.getSales(user, filterQuery);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Retrieve user sales records with optional filtering' })
  @ApiResponse({ type: SaleTrackApiPaginatedResponse<any>, status: 200, description: 'Sales records retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({ type: FilterQuery, description: 'Filtering and pagination parameters' })
  @Get('my-sales')
  async getMySales(@Query() filterQuery: FilterQuery, @User() user: any) {
    const result = await this.salesService.getMySales(User, filterQuery)
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Update user sale record' })
  @ApiResponse({ type: SaleTrackApiResponse<any>, status: 200, description: 'Sale record updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiParam({ name: 'saleId', type: 'string', description: 'Id of the sale record to updated' })
  @ApiBody({ type: UpdateSaleDto, description: 'Update sale payload' })
  @Put('update/:saleId')
  async updateSale(@Param('saleId') saleId: string, @User() user: any, @Body() dto: UpdateSaleDto): Promise<SaleTrackApiResponse<any>>
  {
    const result = await this.salesService.updateSale(user, saleId, dto)    
    return result;
  }


}

