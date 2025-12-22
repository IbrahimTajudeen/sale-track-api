import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ReportsModule } from './reports/reports.module';
import { SalesModule } from './sales/sales.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [SupabaseModule, SalesModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
