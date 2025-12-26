/* eslint-disable prettier/prettier */
import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';
import { AppConfigService } from 'src/config/app-config';
import { SupabaseService } from 'src/supabase/supabase.service'
import { Utils } from 'src/common/utils/index.utils';
import axios from 'axios';

@Injectable()
export class PdfService {
  private readonly apiKey: string;
  private readonly baseUrl: string; // = 'https://api.apiverve.com/v1';
  private readonly logger = new Logger(PdfService.name);

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly supabase: SupabaseService,
    private readonly utils: Utils
  ) {
    const { url, apiKey } = this.appConfig.apiVerve;
    this.apiKey = url; 
    this.baseUrl = apiKey;
  }

  async htmlToPdfAndSave(htmlContent: string, user: { username: string; id: string }, dateRange: { from: Date, to: Date }): Promise<SaleTrackApiResponse<{ fileName: string; path: string; url: string; }>> {
    try {
      if(!this.apiKey) {
        throw new Error('API Key for Apiverve is not configured.');
      }
      
      const { username, id: userId } = user;

      if(!(dateRange.from < dateRange.to)) {
        this.logger.error('Invalid date range')
        throw new BadRequestException('Invalid date range')
      }
      
      /* 1️⃣ Generate PDF */
      const response = await axios.post(
        `${this.baseUrl}/htmltopdf`,
        {
          marginTop: 0.4,
          marginBottom: 0.4,
          marginLeft: 0.4,
          marginRight: 0.4,
          landscape: false,
          html: htmlContent,
        },
        {
          headers: {
            "X-API-Key": this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );
      
      const {
        // pdfName, 
        downloadURL
      } = response.data.data;
      
      if (!downloadURL) {
        throw new BadRequestException("PDF download URL missing");
      }
      
      /* 2️⃣ Download PDF */
      const pdfResponse = await axios.get(downloadURL, {
        responseType: "arraybuffer",
      });
      
      const pdfBuffer = Buffer.from(pdfResponse.data);
      
      const filename = this.utils.generateRequestId(username, dateRange.from, dateRange.to)
      const path = this.utils.supabaseBucketPathBuilder(userId, 'statements', filename)
      
      /* 3️⃣ Upload to Supabase */
      const res = await this.supabase.storageUpload('sales-reports', path, pdfBuffer, 'application/pdf')
      
      if(res.success && res.data)
        {
          /* 4️⃣ Generate signed URL (temporary download) */
          const linkData = await this.supabase.createSignedLink(res.data.path, res.data.bucket_name, filename, 30);
          if(!linkData?.data) {
            throw new InternalServerErrorException('Failed to generate signed link');
          }
          const { fileName, path: filePath, url } = linkData.data as { fileName: string; path: string; url: string };
          return {
            success: true,
            data: { 
              fileName,
              path: filePath,
              url
            },
            message: 'Downloadable link created successfully'
          }
        }
        throw new InternalServerErrorException('Failed to resolve function');
      } catch (error) {
        this.logger.error("PDF generation failed", error);
        throw new BadRequestException(`Failed to generate PDF, Cause: ${error.message}`);
      }
    }
}
