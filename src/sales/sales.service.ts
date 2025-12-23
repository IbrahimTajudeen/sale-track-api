/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { UserRole } from 'src/common/types/user-role.type';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';
import { SupabaseService } from 'src/supabase/supabase.service';

// sales/sales.service.ts
@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);
  constructor(private readonly supabase: SupabaseService) {}

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

  
}
