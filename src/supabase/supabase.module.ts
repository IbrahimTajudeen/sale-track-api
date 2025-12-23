/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { AppConfigModule } from 'src/config/appconfig.module';

@Module({
  imports: [AppConfigModule],
  providers: [SupabaseService],
  exports: [SupabaseService]
})
export class SupabaseModule {}
