/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UserRole } from 'src/common/types/user-role.type';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly pdfServic: PdfService
  ) {}

  async create(dto: CreateReportDto, user: any) {
    try {

      if(user.id || user.role) {
        throw new NotFoundException('User not found');
      }

      if(![UserRole.USER].includes((user.role as UserRole))) {
        this.logger.error('You are not allowed to access this service')
        throw new ForbiddenException('You are not allowed to access this service')
      }

      const { data, error } = await this.supabase.adminClient()
      .rpc('get_user_sales_report_with_user_meta', {
        p_user_id: user.id,
        p_start_date: dto.startDate,
        p_end_date: dto.endDate,
      })

      this.pdfServic.htmlToPdfAndSave

      if(error) {
        this.logger.error(`Failed to fetch user sales record from date range: ${dto.startDate.toDateString()} - ${dto.endDate.toDateString()}`, error)
        throw new InternalServerErrorException('Failed to fetch sales record')
      }



    } catch (error) {      
      throw new error
    }
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
