import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { CommonModule } from 'src/common/common.module';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AppConfigModule } from 'src/config/appconfig.module';

@Module({
  imports: [CommonModule, SupabaseModule, AppConfigModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
