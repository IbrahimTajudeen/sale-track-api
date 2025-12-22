import { Injectable } from '@nestjs/common';
import { CreateSupabaseDto } from './dto/create-supabase.dto';
import { UpdateSupabaseDto } from './dto/update-supabase.dto';

@Injectable()
export class SupabaseService {
  create(createSupabaseDto: CreateSupabaseDto) {
    return 'This action adds a new supabase';
  }

  findAll() {
    return `This action returns all supabase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supabase`;
  }

  update(id: number, updateSupabaseDto: UpdateSupabaseDto) {
    return `This action updates a #${id} supabase`;
  }

  remove(id: number) {
    return `This action removes a #${id} supabase`;
  }
}
