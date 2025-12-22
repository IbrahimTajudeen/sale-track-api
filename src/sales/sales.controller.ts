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
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { User } from '../common/decorators/user.decorator';

@Controller('sales')
@UseGuards(SupabaseAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@User() user, @Body() dto: CreateSaleDto) {
    return this.salesService.create(user.id, dto);
  }

  @Get()
  findAll(@User() user) {
    return this.salesService.findAll(user.id);
  }

  @Put(':id')
  update(
    @User() user,
    @Param('id') id: string,
    @Body() dto: UpdateSaleDto,
  ) {
    return this.salesService.update(user.id, id, dto);
  }
}
