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
import { SupabaseAuthGuard } from 'src/common/guards/supabase.guard'; ;
import { User } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/common/types/user-role.type';
import { Roles } from 'src/common/decorators/role.decorator';


@ApiTags('VTU')
@ApiBearerAuth('access-token')
@Controller('sales')
@UseGuards(SupabaseAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create a new sale record' })
  @ApiResponse({ status: 201, description: 'The sale record has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ type: CreateSaleDto, description: 'Data for creating a new sale record' })
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
