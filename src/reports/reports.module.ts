/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { CommonModule } from 'src/common/common.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { MailModule } from 'src/mail/mail.module';
import { AppConfigModule } from 'src/config/appconfig.module';

@Module({
  imports: [
    SupabaseModule,
    CommonModule,
    PdfModule,
    MailModule,
    AppConfigModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
