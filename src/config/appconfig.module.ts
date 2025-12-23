/* eslint-disable prettier/prettier */
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [AppConfigService],
    exports: [AppConfigService]
})
export class AppConfigModule {}
