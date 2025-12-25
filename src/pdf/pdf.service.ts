/* eslint-disable prettier/prettier */
import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';
import { AppConfigService } from 'src/config/app-config';
import { SupabaseService } from 'src/supabase/supabase.service'

@Injectable()
export class PdfService {
  private readonly apiKey: string;
  private readonly baseUrl: string; // = 'https://api.apiverve.com/v1';
  private readonly logger = new Logger(PdfService.apply);

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly supabase: SupabaseService
  ) {
    const { url, apiKey } = this.appConfig.apiVerve;
    this.apiKey = url; 
    this.baseUrl = apiKey;
  }

  async htmlToPdfAndSave(htmlContent: string, user: any ): Promise<SaleTrackApiResponse<{ fileName: string; storagePath: string; signedUrl: string; }>> {
    try {
      if(!this.apiKey) {
        throw new Error('API Key for Apiverve is not configured.');
      }
      
      const { username, id: userId } = user;
      
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
      
      const filename = this.guidService.generateRequestId(username)
      const path = this.utils.supabaseBucketPathBuilder(userId, 'statements', filename)
      
      /* 3️⃣ Upload to Supabase */
      const res = await this.supabaseService.storageUpload('wallet-pdfs', path, pdfBuffer, 'application/pdf')
      
      if(res.success && res.data)
        {
          /* 4️⃣ Generate signed URL (temporary download) */
          const linkData = await this.supabaseService.createSignedLink(res.data.path, res.data.bucket_name, filename, 30);
          return {
            success: true,
            data: { 
              fileName: linkData.fileName,
              storagePath: linkData.path,
              signedUrl: linkData.signedUrl
            },
            message: 'Downloadable link created successfully'
          }
        }
        throw new InternalServerErrorException('Failed to resolve function');
      } catch (error) {
        this.logger.error("PDF generation failed", error);
        throw new BadRequestException("Failed to generate PDF");
      }
    }
}
