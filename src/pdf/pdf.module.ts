/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AppConfigModule } from 'src/config/appconfig.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    SupabaseModule,
    AppConfigModule,
    CommonModule
  ],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
