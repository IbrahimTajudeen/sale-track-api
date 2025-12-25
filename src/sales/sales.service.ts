/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
    
      const { error } = await this.supabase.adminClient()
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
    
      const { error } = await this.supabase.adminClient()
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
      if(![UserRole.BOSS, UserRole.ADMIN].includes((user.role as UserRole))) {
        this.logger.error('Only Admin or Boss are allowed to use this service')
        throw new ForbiddenException('Only Admin and Boss are allow to use this service');
      }

      const { page = 1, limit = 10 } = filterQuery;
      const start = (page - 1) * limit, end = start + limit - 1;

      let query = this.supabase.adminClient()
      .from('sales_records')
      .select(`
        id,
        user_id,
        sale_date,
        item_name,
        price_per_item,
        quantity,
        total_amount,
        notes,
        user:users (id, raw_user_meta_data)`,
      { count: 'exact' });
      
      query = this.utils.applyFilters(query, filterQuery)
      
      const { data, error, count } = await query
      .range(start, end); // Pagination

      if(error)
      {
        this.logger.error('Failed to retrieve sale records', error)
        throw new BadRequestException('Failed to retrieve sales');
      }

      const result = data.map(sale => {
        const userRecord = Array.isArray(sale.user) ? sale.user[0] : sale.user;
        const metadata = userRecord?.raw_user_meta_data || {};

        return ({
          ...sale,
          user: {
            id: userRecord?.id || sale.user_id,
            firstname: metadata.firstname || '',
            lastname: metadata.lastname || '',
            email: metadata.email || '',
            username: metadata.username || '',
            phone: metadata.phone || ''
          }
        })
      });


      const totalItems = count || 0;
      const totalPages = limit ? Math.ceil(totalItems / limit) : 1;
      return {
        success: true,
        data: result || [],
        currentPage: page,
        pageSize: limit,
        totalItems: totalItems,
        totalPages: totalPages,
      };

    } catch (error) {
      throw error;
    }
  }

  async getSaleById(user: any, saleId: string): Promise<SaleTrackApiResponse<any>> {
    try {
      if(![UserRole.BOSS, UserRole.ADMIN].includes((user.role as UserRole))) {
        this.logger.error('Only Admin or Boss are allowed to use this service')
        throw new ForbiddenException('Only Admin and Boss are allow to use this service');
      }

      const { data, error } = await this.supabase.adminClient()
      .from('sales_records')
      .select(`
        id,
        user_id,
        sale_date,
        item_name,
        price_per_item,
        quantity,
        total_amount,
        notes,
        user:users(id, username, first_name, last_name, phone, email)`)
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
          notes: string,
          user: {
            id: string,
            username: string,
            first_name: string,
            last_name: string,
            phone: string,
            email: string
          }
        }, error: any
        
      };

      if(error) {
        this.logger.error('Failed to get sale record', error)
        throw new BadRequestException('Failed to fetch sale record')
      }

      return {
        success: true,
        data: data,
        message: 'Sale record retrived successfully'
      }
        
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
      if(![UserRole.USER].includes((user.role as UserRole))) {
        this.logger.error(`User with ID ${user.id} and role ${user.role} attempted to retrieve their sale records.`);
        throw new ForbiddenException('Only users with USER role can retrieve their sales records.');
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

  async getMySaleById(user: any, saleId: string): Promise<SaleTrackApiResponse<any>> {
    try { 
      if(user.role as UserRole !== UserRole.USER){
        this.logger.error(`Failed, only a user access this service`)
        throw new ForbiddenException('Failed, Only users can access this service')
      }

      const { data, error } = await this.supabase.adminClient()
      .from('sales_records')
      .select(`
        id,
        user_id,
        sale_date,
        item_name,
        price_per_item,
        quantity,
        total_amount,
        notes`)  
      .eq('id', saleId)
      .maybeSingle() as unknown as {
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
        this.logger.error('Failed to get sale record', error)
        throw new BadRequestException('Failed to fetch sale record')
      }

      if(!data) {
        this.logger.error('Sale record not found')
        throw new NotFoundException('Sale record not found');
      }

      if(data.user_id !== user.id) {
        this.logger.error('You are forbidden to access this sale record')
        throw new ForbiddenException('User forbidden to access sale record')
      }

      return {
        success: true,
        data: data,
        message: 'Sale record retrived successfully'
      }

    } catch (error) {
      throw error;
    }
  }

  async updateSale(user: any, saleId: string, dto: UpdateSaleDto): Promise<SaleTrackApiResponse<any>>{
    try {
      if(user.role as UserRole !== UserRole.USER){
        this.logger.error(`Failed, only a user access this service`)
        throw new ForbiddenException('Failed, Only users can access this service')
      }

      if(!dto.quantity || !dto.pricePerItem) {
        this.logger.error(`Both the field quantity and price per item are required`)
        throw new BadRequestException('Both the field quantity and price per item are required')
      }

      const { data, error } = await this.supabase.adminClient()
      .from('sales_records')
      .select(`
        id,
        user_id,
        sale_date,
        item_name,
        price_per_item,
        quantity,
        total_amount,
        notes`)
      .eq('id', saleId)
      .maybeSingle() as unknown as {
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
        this.logger.error('failed to get sale record', error)
        throw new BadRequestException('Failed to get sale record')
      }

      if(!data) {
        this.logger.error(`Sales not found for update: ${saleId}`, data)
        throw new NotFoundException('Sale not found')
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

      const { error: updateError } = await this.supabase.adminClient()
      .from('sales_records')
      .update(record)
      .eq('id', saleId)

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

  async deleteMySale(user: any, saleId: string) : Promise<SaleTrackApiResponse<any>> {
    try {
      if(![UserRole.USER].includes(user.role)) {
        this.logger.error(`Failed, only a user access this service`)
        throw new ForbiddenException('Failed, Only users can access this service')
      }

      const { data: findData, error: findError } = await this.supabase.adminClient()
      .from('sales_records')
      .select(`id, user_id, item_name`)
      .eq('id', saleId)
      .maybeSingle()

      if(findError) {
        this.logger.error('Unknown error occured', findError)
        throw new InternalServerErrorException('Unknown error occured')
      }

      if(!findData) {
        this.logger.error(`Unable to find sale record`, findError)
        throw new NotFoundException('Unable to find sale record')
      }

      if(findData?.user_id !== user.id) {
        this.logger.error('Not authorize to perform this action')
        throw new UnauthorizedException('Not authorize to perform this action')
      }

      const { data, error } = await this.supabase.adminClient()
      .from('sales_records')
      .delete()
      .eq('id', saleId)
      .select('item_name, quantity, total_amount, price_per_item, sale_date')

      if(error) {
        this.logger.error('Failed to delete sale item', error)
        throw new InternalServerErrorException('An error occured')
      }

      return {
        success: true,
        data,
        message: 'Record deleted successfully'
      }

    } catch (error) {
      throw error;
    }
  }
}