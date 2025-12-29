/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface App {

}

interface Supabase {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
    jwtAudience: string;
    jwtSecret: string;
    projectId: string;
}

interface NodeMailer {
    host: string;       // SMTP_HOST=smtp.gmail.com
    port: number;       // SMTP_PORT=465
    isSecure: boolean;  // SMTP_SECURE=true
    user: string;       // SMTP_USER=saletrack@gmail.com
    pass: string;       // SMTP_PASS=your_app_password 
    from: string;       // MAIL_FROM="SaleTrack Reports <saletrack@gmail.com>"
}

interface ApiVerve {
    url: string;
    apiKey: string;
}

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    get app(): number {
        return this.configService.get<number>('PORT', 3100);
    }

    get mail(): NodeMailer {
        return {
            host: this.configService.get<string>('SMTP_HOST', ''),
            port: this.configService.get<number>('SMTP_PORT', 0),
            isSecure: this.configService.get<boolean>('SMTP_SECURE', false),
            user: this.configService.get<string>('SMTP_USER', ''),
            pass: this.configService.get<string>('SMTP_PASS', ''),
            from: this.configService.get<string>('MAIL_FROM', '')
        }
    }

    get supabase(): Supabase {
        return {
            url: this.configService.get<string>('SUPABASE_URL', ''),
            anonKey: this.configService.get<string>('SUPABASE_ANON_KEY', ''),
            serviceRoleKey: this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY', ''),
            jwtAudience: this.configService.get<string>('SUPABASE_JWT_AUDIENCE', 'authenticated'),
            jwtSecret: this.configService.get<string>('SUPABASE_JWT_SECRET', ''),
            projectId: this.configService.get<string>('SUPABASE_PROJECT_ID', ''),
        };
    }

    get apiVerve(): ApiVerve {
        return {
            url: this.configService.get<string>('APIVERVE_URL',''),
            apiKey: this.configService.get<string>('APIVERVE_API_KEY','')
        };
    }
}
