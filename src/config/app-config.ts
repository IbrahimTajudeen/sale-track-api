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

interface Smtp {
    host: string;
    port: number;
    user: string;
    pass: string;
}

interface ApiVerve {
    apiKey: string;
}

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    get app(): number {
        return this.configService.get<number>('PORT', 3100);
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
}
