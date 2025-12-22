import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { CreateSupabaseDto } from './dto/create-supabase.dto';
import { UpdateSupabaseDto } from './dto/update-supabase.dto';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post()
  create(@Body() createSupabaseDto: CreateSupabaseDto) {
    return this.supabaseService.create(createSupabaseDto);
  }

  @Get()
  findAll() {
    return this.supabaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supabaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupabaseDto: UpdateSupabaseDto) {
    return this.supabaseService.update(+id, updateSupabaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supabaseService.remove(+id);
  }
}
