/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer'
import { AppConfigService } from 'src/config/app-config';

interface SendSaleReportEmailProps {
  to: string;
  username: string;
  firstname: string;
  lastname: string;
  reportDate: string;
  pdfBuffer: Buffer<any> | undefined;
}

@Injectable()
export class MailService {
  private mailTransporter;
  constructor(private readonly config: AppConfigService) {
    const mailConfig = config.mail;
    this.mailTransporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.isSecure,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
      },
    });
  }

  async sendSaleReportEmail({
    to,
    username,
    firstname,
    lastname,
    reportDate,
    pdfBuffer,
  }: SendSaleReportEmailProps) {
    try {
      const mailOptions = {
        from: this.config.mail.from,
        to,
        subject: `SaleTrack Sales Report - ${reportDate} for ${username}`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>SaleTrack Sales Report For ${firstname} ${lastname}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

            <!-- Wrapper -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding: 20px 0;">
              <tr>
                <td align="center">

                  <!-- Card -->
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                      <td style="background-color:#0d6efd; padding:20px; text-align:center;">
                        <h1 style="margin:0; font-size:22px; color:#ffffff;">
                          📊 SaleTrack
                        </h1>
                        <p style="margin:6px 0 0; color:#e9f1ff; font-size:14px;">
                          Smart Sales Analytics & Reporting
                        </p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding:30px; color:#333333;">

                        <h2 style="margin-top:0; font-size:20px; color:#111;">
                          Hello Boss,
                        </h2>

                        <p style="font-size:14px; line-height:1.6; color:#555;">
                          Here is ${username}'s <strong>sales performance report</strong> for the selected period is now ready.
                          We’ve generated a detailed PDF containing the sales records, analytics, and totals.
                        </p>

                        <!-- Info Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:#f8f9fa; border-radius:6px;">
                          <tr>
                            <td style="padding:15px;">
                              <p style="margin:0; font-size:14px;">
                                📅 <strong>Report Period:</strong> ${reportDate}
                              </p>
                              <p style="margin:8px 0 0; font-size:14px;">
                                📎 <strong>Attachment:</strong> Sales Report (PDF)
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="font-size:14px; line-height:1.6; color:#555;">
                          You can download and review the full report from the attached PDF file.
                          If you notice anything unusual or need assistance, feel free to contact us.
                        </p>

                        <!-- CTA -->
                        <div style="text-align:center; margin:30px 0;">
                          <a href="#" style="
                            background-color:#0d6efd;
                            color:#ffffff;
                            padding:12px 22px;
                            font-size:14px;
                            border-radius:6px;
                            text-decoration:none;
                            display:inline-block;
                          ">
                            View Dashboard
                          </a>
                        </div>

                        <p style="font-size:13px; color:#777;">
                          Thank you for choosing <strong>SaleTrack</strong> to manage your business insights.
                        </p>

                        <p style="margin-top:30px; font-size:13px; color:#555;">
                          Regards,<br />
                          <strong style="padding: 5px 0px">SaleTrack Team</strong>
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color:#f1f3f5; padding:15px; text-align:center;">
                        <p style="margin:0; font-size:12px; color:#888;">
                          © ${new Date().getFullYear()} SaleTrack From NexoTechnology. All rights reserved.
                        </p>
                        <p style="margin:5px 0 0; font-size:12px; color:#888;">
                          This email was generated automatically. Please do not reply.
                        </p>
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>
        `,
        attachments: [
          {
            filename: `${username}-sales-report-${reportDate}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      await this.mailTransporter.sendMail(mailOptions);

      return {
        success: true,
        message: `Sales report email sent successfully to ${to}`,
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

}
