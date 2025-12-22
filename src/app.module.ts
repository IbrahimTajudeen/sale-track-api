import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { MailModule } from './mail/mail.module';
import { PdfModule } from './pdf/pdf.module';
import { ReportsModule } from './reports/reports.module';
import { SalesModule } from './sales/sales.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [SupabaseModule, SalesModule, ReportsModule, PdfModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
