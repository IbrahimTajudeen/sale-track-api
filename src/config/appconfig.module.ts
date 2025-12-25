/* eslint-disable prettier/prettier */
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config';

@Module({
    imports: [],
    providers: [AppConfigService],
    exports: [AppConfigService]
})
export class AppConfigModule {}
