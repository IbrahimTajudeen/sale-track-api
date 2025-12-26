/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UserRole } from 'src/common/types/user-role.type';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async create(createReportDto: CreateReportDto, user: any) {
    try {

      if(![UserRole.USER].includes((user.role as UserRole))) {
        this.logger.error('You are not allowed to access this service')
        throw new ForbiddenException('You are not allowed to access this service')
      }

      const { data, error } = await this.supabase.adminClient()
      .from()

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
