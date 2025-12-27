/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

      if(!user.id || !user.role) {
        throw new NotFoundException('User not found');
      }

      if(![UserRole.USER].includes((user.role as UserRole))) {
        this.logger.error('You are not allowed to access this service')
        throw new ForbiddenException('You are not allowed to access this service')
      }

      const userId = user.id as string;
      const rpc_payload = {
        p_user_id: userId,
        p_start_date: dto.startDate,
        p_end_date: dto.endDate
      };

      const { data, error } = await this.supabase.client()
      .rpc('get_user_sales_report_with_user_meta', rpc_payload)      

      const rpc_response = (Array.isArray(data) ? data[0].result : data.result) as unknown as any;

      if (error) {
        this.logger.error(`Failed to fetch user sales record from date range: `, error)
        throw new InternalServerErrorException('Failed to fetch sales record')
      }

      const dataInfo = {
        userData: rpc_response.user,
        analytics: {
          totalSaleRange: rpc_response.total_sale_range,
          totalAmountRange: rpc_response.total_amount_range,
          totalSale: rpc_response.total_sale,
          totalAmount: rpc_response.total_amount,
        },
        records: rpc_response.rows
      }

      const pureHTML = await this.pdfService.generateHTML(dataInfo.userData, dataInfo.analytics, dataInfo.records)

      const linkInfo = await this.pdfService.htmlToPdfAndSave(pureHTML, {
          username: rpc_response.user.username,
          id: rpc_response.user.id,
        }, {
          from: dto.startDate,
          to: dto.endDate
      })

      this.logger.log(`Link info: ${JSON.stringify(linkInfo, null, 2)}`)

      const reportInfo: GeneratedReport = {
        user_id: userId,
        start_date: dto.startDate,
        end_date: dto.endDate,
        total_sales: rpc_response.total_amount_range,
        total_items: rpc_response.total_sale_range,
        pdf_path: linkInfo.data?.path || '',
        sent_to_email: dto.sendEmail ? dto.sendEmail : '',
        sent_at: new Date(Date.now())
      }

      const result = await this.generateReport(reportInfo);

      this.logger.log(`Generate: ${JSON.stringify(result, null, 2)}`)

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
