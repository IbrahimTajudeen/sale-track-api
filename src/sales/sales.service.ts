/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { UserRole } from 'src/common/types/user-role.type';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SaleTrackApiPaginatedResponse } from 'src/common/utils/paginated-api-response.util';
import { Utils } from 'src/common/utils/index.utils';
import { NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

// sales/sales.service.ts
@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);
  constructor(
    private readonly supabase: SupabaseService, 
    private readonly utils: Utils
  ) {}

  async createSales(user: any, dto: CreateSaleDto) : Promise<SaleTrackApiResponse<any>> {
    try {

      if(user.role as UserRole !== UserRole.USER) {
        this.logger.error(`User with ID ${user.id} and role ${user.role} attempted to create a sale record.`);
        throw new Error('Only users with USER role can create sales records.');
      }
      const total = dto.pricePerItem * dto.quantity;
      const userId = user.id;
    
      const { error } = await this.supabase.client()
      .from('sales_records')
      .insert({
        user_id: userId,
        sale_date: dto.saleDate,
        item_name: dto.itemName,
        price_per_item: dto.pricePerItem,
        quantity: dto.quantity,
        total_amount: total,
      });

      if(error)
      {
        this.logger.error('Failed to create add sale record', error)
        throw new BadRequestException('Failed to add sale');
      }

      return {
        success: true,
        data: null,
        message: 'Sale record created successfully',
      }

    } catch (error) {
      throw error;
    }
  }

  async createBulkSales(user: any, dtos: CreateSaleDto[]) : Promise<SaleTrackApiResponse<{ insertedRecords: number }>> {
    try {
      if(user.role as UserRole !== UserRole.USER) {
        this.logger.error(`User with ID ${user.id} and role ${user.role} attempted to create a sale record.`);
        throw new Error('Only users with USER role can create sales records.');
      }

      const userId = user.id;
      let records = dtos.map(dto => ({
        user_id: userId,
        sale_date: dto.saleDate,
        item_name: dto.itemName,
        price_per_item: dto.pricePerItem,
        quantity: dto.quantity,
        total_amount: dto.pricePerItem * dto.quantity,
      }));
    
      const { error } = await this.supabase.client()
      .from('sales_records')
      .insert(records);

      if(error)
      {
        this.logger.error('Failed to create bulk sale records', error)
        throw new BadRequestException('Failed to add bulk sales');
      }

      return {
        success: true,
        data: {
          insertedRecords: dtos.length
        },
        message: 'Bulk sale records created successfully',
      }
    } catch (error) {
      throw error;
    }
  }

  async getSales(user: any, filterQuery: any) : Promise<SaleTrackApiPaginatedResponse<any>> {
    try {
      // Placeholder implementation
      if(user.role as UserRole !== UserRole.ADMIN && user.role as UserRole !== UserRole.BOSS) {
        this.logger.error(`User with ID ${user.id} and role ${user.role} attempted to retrieve sale records.`);
        throw new Error('Only users with ADMIN or BOSS role can retrieve sales records.');
      }

      const { page = 1, limit = 10 } = filterQuery;
      const start = (page - 1) * limit, end = start + limit - 1;

      let query = this.supabase.adminClient()
      .from('sales_records')
      .select('*', { count: 'exact' });
      
      query = this.utils.applyFilters(query, filterQuery)
      
      const { data, error, count } = await query
      .range(start, end); // Pagination

      if(error)
      {
        this.logger.error('Failed to retrieve sale records', error)
        throw new BadRequestException('Failed to retrieve sales');
      }

      const totalItems = count || 0;
      const totalPages = limit ? Math.ceil(totalItems / limit) : 1;
      return {
        success: true,
        data: data || [],
        currentPage: page,
        pageSize: limit,
        totalItems: totalItems,
        totalPages: totalPages,
      };

    } catch (error) {
      throw error;
    }
  }

  async getMySales(user: any, filterQuery: any) : Promise<SaleTrackApiPaginatedResponse<any>> {
    try {

      if(!user.id) {
        this.logger.error(`User not found.\nUser: ${JSON.stringify(user)}`)
        throw new NotFoundException('User not found');
      }

      // Placeholder implementation
      if(user.role as UserRole !== UserRole.USER) {
        this.logger.error(`User with ID ${user.id} and role ${user.role} attempted to retrieve their sale records.`);
        throw new Error('Only users with USER role can retrieve their sales records.');
      }

      const { page = 1, limit = 10 } = filterQuery;
      const start = (page - 1) * limit, end = start + limit - 1;

      let query = this.supabase.adminClient()
      .from('sales_records')
      .select('*', { count: 'exact' });
      
      query = this.utils.applyFilters(query, filterQuery)
      
      const { data, error, count } = await query
      .eq('user_id', user.id)
      .range(start, end); // Pagination

      if(error)
      {
        this.logger.error('Failed to retrieve user sales records', error)
        throw new BadRequestException('Failed to retrieve user sales');
      }

      const totalItems = count || 0;
      const totalPages = limit ? Math.ceil(totalItems / limit) : 1;
      return {
        success: true,
        data: data || [],
        currentPage: page,
        pageSize: limit,
        totalItems: totalItems,
        totalPages: totalPages,
      };

    } catch (error) {
      throw error;
    }
  }

  async updateSale(user: any, saleId: string, dto: UpdateSaleDto): Promise<SaleTrackApiResponse<any>>{
    try {
      if(user.role as UserRole !== UserRole.USER){
        this.logger.error(`Failed, only a user can update sale record`)
        throw new ForbiddenException('Failed, Only users can update sale record')
      }

      const { data, error } = await this.supabase.client()
      .from('sales_records')
      .select(`
        id,
        user_id,
        sale_date,
        item_name,
        price_per_item,
        quantity,
        total_amount,
        notes,`)
      .eq('id', saleId)
      .single() as unknown as {
        data: {
          id: string,
          user_id: string,
          sale_date: Date,
          item_name: string,
          price_per_item: number,
          quantity: number,
          total_amount: number,
          notes: string
        }, error: any
        
      };

      if(error) { 
        this.logger.error('failed to get sale record')
        throw new BadRequestException('Failed to get sale record')
      }

      if(data.user_id !== user.id) {
        this.logger.error('You can only edit sales created by you')
        throw new UnauthorizedException(`You can only edit sales created by you`)
      }

      const record = {
        id: saleId,
        user_id: user.id,
        sale_date: dto.saleDate,
        item_name: dto.itemName,
        price_per_item: dto.pricePerItem,
        quantity: dto.quantity,
        total_amount: dto.pricePerItem * dto.quantity,
        notes: dto.notes
      }

      const { error: updateError } = await this.supabase.client()
      .from('sales_records')
      .update(record)

      if(updateError) {
        this.logger.error(`Failed to update sale record`, error)
        throw new BadRequestException('Failed to update sale record')
      }

      return {
        success: true,
        data: {
          itemName: dto.itemName,
          saleDate:  dto.saleDate
        },
        message: 'Sale record updated successfully'
      }

    } catch (error) {
      throw error;
    }
  }
}
