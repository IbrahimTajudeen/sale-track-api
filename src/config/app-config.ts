import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface App {

}

interface Supabase {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
    jwtAudience: string;
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
