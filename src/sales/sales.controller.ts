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
import { SupabaseAuthGuard } from 'src/common/guards/supabase.guard';
import { User } from 'src/common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/common/types/user-role.type';
import { Roles } from 'src/common/decorators/role.decorator';
import {
  SaleTrackApiResponse,
  SaleTrackApiPaginatedResponse,
} from 'src/common/utils/index.utils';
import { FilterQuery } from 'src/common/types/filter-query.type';

@ApiTags('Sales')
@ApiBearerAuth('access-token')
@UseGuards(SupabaseAuthGuard) // Auth applied globally to controller
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /* ============================
   * USER ROUTES (MOST SPECIFIC)
   * ============================ */

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Retrieve user sales records with optional filtering' })
  @ApiResponse({
    type: SaleTrackApiPaginatedResponse<any>,
    status: 200,
    description: 'Sales records retrieved successfully',
  })
  @ApiQuery({ type: FilterQuery })
  @Get('my-sales')
  async getMySales(
    @Query() filterQuery: FilterQuery,
    @User() user: any,
  ): Promise<SaleTrackApiPaginatedResponse<any>> {
    return this.salesService.getMySales(user, filterQuery);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Retrieve user sale record by id' })
  @ApiResponse({ type: SaleTrackApiResponse<any>, status: 200 })
  @Get('my-sales/:id')
  async getMySaleUsingId(
    @Param('id') saleId: string,
    @User() user: any,
  ): Promise<SaleTrackApiResponse<any>> {
    return this.salesService.getMySaleById(user, saleId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create a new sale record' })
  @ApiBody({ type: CreateSaleDto })
  @Post('add-sales')
  async create(
    @User() user: any,
    @Body() dto: CreateSaleDto,
  ): Promise<SaleTrackApiResponse<any>> {
    return this.salesService.createSales(user, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create multiple sale records in bulk' })
  @ApiBody({ type: [CreateSaleDto] })
  @Post('bulk')
  async createBulk(
    @User() user: any,
    @Body() dtos: CreateSaleDto[],
  ): Promise<SaleTrackApiResponse<{ insertedRecords: number }>> {
    return this.salesService.createBulkSales(user, dtos);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Update user sale record' })
  @ApiParam({ name: 'saleId', type: 'string' })
  @ApiBody({ type: UpdateSaleDto })
  @Put('update/:saleId')
  async updateSale(
    @Param('saleId') saleId: string,
    @User() user: any,
    @Body() dto: UpdateSaleDto,
  ): Promise<SaleTrackApiResponse<any>> {
    return this.salesService.updateSale(user, saleId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Update user sale record' })
  @ApiParam({ name: 'saleId', type: 'string' })
  @ApiBody({ type: UpdateSaleDto })
  @Put('delete/:saleId')
  async deleteSale(
    @Param('saleId') saleId: string,
    @User() user: any,
    @Body() dto: UpdateSaleDto,
  ): Promise<SaleTrackApiResponse<any>> {
    return this.salesService.deleteMySale(user, saleId);
  }

  /* ============================
   * ADMIN / BOSS ROUTES (LAST)
   * ============================ */

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BOSS)
  @ApiOperation({ summary: 'Retrieve all sales records (admin)' })
  @ApiResponse({
    type: SaleTrackApiPaginatedResponse<any>,
    status: 200,
  })
  @ApiQuery({ type: FilterQuery })
  @Get('admin/get-sales')
  async getSales(
    @Query() filterQuery: FilterQuery,
    @User() user: any,
  ): Promise<SaleTrackApiPaginatedResponse<any>> {
    return this.salesService.getSales(user, filterQuery);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BOSS)
  @ApiOperation({ summary: 'Retrieve sale record by id (admin)' })
  @ApiResponse({ type: SaleTrackApiResponse<any>, status: 200 })
  @Get(':id')
  async getSaleId(
    @Param('id') saleId: string,
    @User() user: any,
  ): Promise<SaleTrackApiResponse<any>> {
    return this.salesService.getSaleById(user, saleId);
  }
}
