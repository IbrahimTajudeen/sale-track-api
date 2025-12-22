import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

// sales/sales.service.ts
@Injectable()
export class SalesService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(userId: string, dto: CreateSaleDto) {
    const total = dto.pricePerItem * dto.quantity;

    return this.supabase.client
      .from('sales_records')
      .insert({
        user_id: userId,
        sale_date: dto.saleDate,
        item_name: dto.itemName,
        price_per_item: dto.pricePerItem,
        quantity: dto.quantity,
        total_amount: total,
      });
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
