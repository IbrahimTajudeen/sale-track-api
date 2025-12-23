/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { PdfModule } from './pdf/pdf.module';
import { ReportsModule } from './reports/reports.module';
import { SalesModule } from './sales/sales.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AppConfigService } from './config/app-config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SupabaseModule, SalesModule, ReportsModule, PdfModule, MailModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
  exports: [AppConfigService]
})
export class AppModule {}
