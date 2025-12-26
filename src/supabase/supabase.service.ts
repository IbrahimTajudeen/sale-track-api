/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';

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

  async storageUpload(bucketName: string, path: string, buffer: any, contenttype: string): Promise<SaleTrackApiResponse<{ path: string, bucket_name: string }>>
  {
    const { error: uploadError } = await this.adminClient().storage
      .from(bucketName)
      .upload(path, buffer, {
        contentType: contenttype,
        upsert: true,
      });

      if (uploadError) {
        this.logger.error(uploadError.message);
        throw new BadRequestException("Failed to upload PDF");
      }
      return {
        success: true,
        data: { path, bucket_name: bucketName },
        message: 'file uploaded successfully'
      }
  }

  /* 4️⃣ Generate signed URL (temporary download) */
  async createSignedLink(path: string, bucketName: string, fileName: string, minutes: number = 30):Promise<SaleTrackApiResponse<{fileName: string, path: string, url}>> {
    
    const { data: signed, error: signedError } =
      await this.adminClient().storage
        .from(bucketName)
        .createSignedUrl(path, 60 * minutes); // 30 minutes default
      if (signedError) {
        throw new BadRequestException("Failed to create download link");
      }

      return {
        success: true,
        data: { fileName: fileName, path, url: signed.signedUrl },
        message: 'signed link created successfully'
      };
  }
}
