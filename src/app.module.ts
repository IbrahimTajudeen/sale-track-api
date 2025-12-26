/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { PdfModule } from './pdf/pdf.module';
import { ReportsModule } from './reports/reports.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';
import { Utils } from './common/utils/utils';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [
    AuthModule,
    SalesModule,
    ReportsModule,
    PdfModule,
    MailModule,
    SupabaseModule,
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
  ],
  controllers: [AppController],
  providers: [AppService, Utils],
  exports: [Utils],
})
export class AppModule {}
