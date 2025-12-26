import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { SaleTrackApiResponse } from 'src/common/utils/index.utils';
import { User } from 'src/common/decorators/user.decorator';
import { SupabaseAuthGuard } from 'src/common/guards/supabase.guard';

@UseGuards(SupabaseAuthGuard)
@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}


  @Post('create-report')
  async createReport(@Body() dto: CreateReportDto, @User() user: any): Promise<SaleTrackApiResponse<any>> {
    return await this.reportsService.create(dto, user);
  }

}
