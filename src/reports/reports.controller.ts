import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { SaleTrackApiResponse } from 'src/common/utils/index.utils';
import { User } from 'src/common/decorators/user.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/common/types/user-role.type';
import { Roles } from 'src/common/decorators/role.decorator';
import { SupabaseAuthGuard } from 'src/common/guards/supabase.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}


  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Post('create-report')
  async createReport(@Body() dto: CreateReportDto, @User() user: any): Promise<SaleTrackApiResponse<any>> {
    return await this.reportsService.create(dto, user);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Get()
  async getReports(@User() user: any): Promise<any> {
    const role: UserRole = user.role as UserRole;
    if (role === UserRole.USER)
      return 'user reports';

    return 'Admin or Boss Reports';
  }

}
