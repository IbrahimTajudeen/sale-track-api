/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

  constructor(private readonly supabase: SupabaseService) {}


  getHello(): string {
    return 'Hello World!';
  }
  async check(): Promise<{ status: string, database: string, timestamp: string }> {
    const dbOk = await this.supabase.adminClient()
      .from('sales_records')
      .select('id')
      .limit(1);

    return {
      status: 'ok',
      database: dbOk.error ? 'down' : 'up',
      timestamp: new Date().toISOString(),
    };
  }

}
