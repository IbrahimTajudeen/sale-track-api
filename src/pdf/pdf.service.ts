/* eslint-disable @typescript-eslint/require-await */
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

  async generateHTML(userData: {
    username: string,
    firstname: string,
    lastname: string
  }, analytics: {
    totalSaleRange: number,
    totalAmountRange: number,
    totalSale: number,
    totalAmount: number,
  }, 
  records: any[]): Promise<string> {

    const rows = records
      .map((r, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${r.id}</td>
          <td>${r.item_name}</td>
          <td>${r.quantity}</td>
          <td>₦${Number(r.price_per_item).toLocaleString()}</td>
          <td>₦${Number(r.total_amount).toLocaleString()}</td>
          <td>${new Date(r.sale_date).toLocaleDateString()}</td>
        </tr>
      `).join('')

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Sales Report</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 30px;
            color: #333;
          }
          h1 {
            text-align: center;
            margin-bottom: 5px;
          }
          .subtitle {
            text-align: center;
            margin-bottom: 30px;
            font-size: 14px;
            color: #777;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            font-size: 13px;
            text-align: left;
          }
          th {
            background: #f5f5f5;
            text-transform: uppercase;
            font-size: 12px;
          }
          .total {
            margin-top: 20px;
            font-size: 16px;
            font-weight: bold;
            text-align: right;
          }
          footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #999;
          }
        </style>
      </head>
      <body>

        <h1>Sales Report</h1>
        <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Sale UUID</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="6">No records found</td></tr>`}
          </tbody>
        </table>

        <div class="total">
          Grand Total: ₦${analytics.totalAmountRange.toLocaleString()}
        </div>
    
        <footer>
          SaleTrack © ${new Date().getFullYear()} from: NexoTechnology
        </footer>

      </body>
    </html>`
  }
}
