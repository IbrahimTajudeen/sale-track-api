/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { UserRole } from 'src/common/types/user-role.type';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';
import { SupabaseService } from 'src/supabase/supabase.service';

// sales/sales.service.ts
@Injectable()
export class SalesService {
  private logger = new Logger(SalesService.name);
  constructor(private readonly supabase: SupabaseService) {}

  async createSales(user: any, dto: CreateSaleDto) : Promise<SaleTrackApiResponse<any>> {
    try {
      if(user.role as UserRole !== UserRole.USER) {
        this.logger.warn(`User with ID ${user.id} and role ${user.role} attempted to create a sale record.`);
        throw new Error('Only users with USER role can create sales records.');
      }
      const total = dto.pricePerItem * dto.quantity;
      const userId = user.id;
    
      const { data, error } = await this.supabase
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
        data: data,
        message: 'Sale record added successfully'
      }

    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string) {
    return this.supabase.client
      .from('sales_records')
      .select('*')
      .eq('user_id', userId)
      .order('sale_date', { ascending: false });
  }

  async update(userId: string, id: string, dto: UpdateSaleDto) {
    const updates: any = { ...dto };

    if (dto.pricePerItem && dto.quantity) {
      updates.total_amount = dto.pricePerItem * dto.quantity;
    }

    return this.supabase.client
      .from('sales_records')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId);
  }
}
