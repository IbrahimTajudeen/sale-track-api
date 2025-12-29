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
    this.apiKey = apiKey; 
    this.baseUrl = url;
  }

  async htmlToPdfAndSave(htmlContent: string, user: { username: string; id: string }, dateRange: { from: Date, to: Date }): Promise<SaleTrackApiResponse<{ fileName: string; path: string; url: string; buffer: Buffer<any> }>> {
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
      this.logger.log('PDF Downloaded =============================')
      
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
              url,
              buffer: pdfBuffer
            },
            message: 'Downloadable link created successfully'
          }
        }
        throw new InternalServerErrorException('Failed to resolve function');
      } catch (error) {
        this.logger.error("PDF generation failed", error);
        throw error; //(`Failed to generate PDF, Cause: ${error.message}`);
      }
  }

  async generateHTML(userData: {
    username: string,
    first_name: string,
    last_name: string
  }, analytics: {
    totalSaleRange: number,
    totalAmountRange: number,
    totalSale: number,
    totalAmount: number,
  }, 
  records: [{
      item_name: string,
      quantity: number,
      price_per_item: number,
      total_amount: number,
      sale_date: string,
    }]): Promise<string> {

    const rows = records
      .map((r) => `
        <tr>
          <td>${new Date(r.sale_date).toLocaleDateString()}</td>
          <td>${r.item_name}</td>
          <td>${r.quantity}</td>
          <td>₦${Number(r.price_per_item).toLocaleString()}</td>
          <td class="amount">₦${Number(r.total_amount).toLocaleString()}</td>
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
      margin: 0;
      padding: 0;
      background: #f5f7fa;
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
    }

    .page {
      max-width: 900px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    /* ================= HEADER ================= */
    .header {
      padding: 30px 40px;
      border-bottom: 1px solid #e5e7eb;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
    }

    .header p {
      margin-top: 6px;
      font-size: 13px;
      color: #6b7280;
    }

    /* ================= USER CONTAINER ================= */
    .user-container {
      padding: 30px 40px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .user-box {
      font-size: 13px;
    }

    .user-box span {
      display: block;
      color: #6b7280;
      margin-bottom: 6px;
    }

    .user-box strong {
      font-size: 14px;
      font-weight: 600;
    }

    /* ================= ANALYTICS ================= */
    .analytics {
      padding: 30px 40px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .card {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }

    .card span {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .card strong {
      font-size: 18px;
      font-weight: 700;
    }

    .green {
      color: #16a34a;
    }

    /* ================= TABLE ================= */
    .table-section {
      padding: 30px 40px 40px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    thead {
      background: #f3f4f6;
    }

    th, td {
      padding: 12px 10px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
    }

    tbody tr:hover {
      background: #f9fafb;
    }

    .amount {
      font-weight: 600;
    }

    .footer-note {
      margin-top: 20px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="page">

    <!-- HEADER -->
    <div class="header">
      <h1>Sales Report</h1>
      <p>Generated summary of user sales activity</p>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>

    <!-- USER INFO -->
    <div class="user-container">
      <div class="user-box">
        <span>Username</span>
        <strong>${userData.username}</strong>
      </div>

      <div class="user-box">
        <span>First Name</span>
        <strong>${userData.first_name}</strong>
      </div>

      <div class="user-box">
        <span>Last Name</span>
        <strong>${userData.last_name}</strong>
      </div>
    </div>

    <!-- ANALYTICS -->
    <div class="analytics">
      <div class="card">
        <span>Total Sales (Range)</span>
        <strong>${analytics.totalSaleRange}</strong>
      </div>

      <div class="card">
        <span>Total Amount (Range)</span>
        <strong class="green">₦${analytics.totalAmountRange}</strong>
      </div>

      <div class="card">
        <span>Total Sales</span>
        <strong>${analytics.totalSale}</strong>
      </div>

      <div class="card">
        <span>Total Amount</span>
        <strong class="green">₦${analytics.totalAmount}</strong>
      </div>
    </div>

    <!-- RECORDS TABLE -->
    <div class="table-section">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
            ${rows || `<tr><td colspan="6">No records found</td></tr>`}
        </tbody>
      </table>

      <div class="footer-note">
        <p>This report is system generated and does not require a signature.</p>
        <footer>
          SaleTrack © ${new Date().getFullYear()} from: NexoTechnology
        </footer>
      </div>
    </div>

  </div>

</body>
</html>
`
  }
}
