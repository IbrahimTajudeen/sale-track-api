/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabaseClient: SupabaseClient;
  private supabaseAdminClient: SupabaseClient;

  constructor(private readonly configService: AppConfigService) {

    const supabaseConfig = this.configService.supabase as {
      url: string;
      anonKey: string;
      serviceRoleKey: string;
    };

    this.supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    });
    
    this.supabaseAdminClient = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    });

    this.logger.log('Supabase clients initialized');
  }

  client(): SupabaseClient {
    return this.supabaseClient;
  }

  adminClient(): SupabaseClient {
    return this.supabaseAdminClient;
  }

}
