/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UserRole } from 'src/common/types/user-role.type';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PdfService } from 'src/pdf/pdf.service';
import { GeneratedReport } from './dto/generated-report.dto';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly pdfService: PdfService
  ) {}

  async create(dto: CreateReportDto, user: any): Promise<SaleTrackApiResponse<any>> {
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

      if (error) {
        this.logger.error(`Failed to fetch user sales record from date range: ${dto.startDate.toDateString()} - ${dto.endDate.toDateString()}`, error)
        throw new InternalServerErrorException('Failed to fetch sales record')
      }

      const dataInfo = {
        userData: data.user,
        analytics: {
          totalSaleRange: data.total_sale_range,
          totalAmountRange: data.total_amount_range,
          totalSale: data.total_sale,
          totalAmount: data.total_amount,
        },
        records: data.rows
      }

      const pureHTML = await this.pdfService.generateHTML(dataInfo.userData, dataInfo.analytics, dataInfo.records)

      const linkInfo = await this.pdfService.htmlToPdfAndSave(pureHTML, {
        username: data.user.username,
        id: data.user.id,
      }, {
        from: dto.startDate,
        to: dto.endDate
      })

      const reportInfo: GeneratedReport = {
        user_id: user.id,
        start_date: dto.startDate,
        end_date: dto.endDate,
        total_sales: data.total_amount_range,
        total_items: data.total_sale_range,
        pdf_path: linkInfo.data?.path || '',
        sent_to_email: dto.sendEmail ? dto.sendEmail : '',
        sent_at: new Date(Date.now())
      }

      const result = await this.generateReport(reportInfo);

      return {
        success: true,
        data: null,
        message: result
      }



    } catch (error) {      
      throw error
    }
  }

  async generateReport(dto: GeneratedReport): Promise<string> {
    try {
       const { error } = await this.supabase.adminClient()
       .from('generated_reports')
       .insert(dto)

       if(error) {
        this.logger.error('Failed to insert generated reports', error)
        throw new InternalServerErrorException('Failed to save the generated report')
       }

       return 'Report saved successfully'

    } catch (error) { 
      throw error;
    }
  }
}
