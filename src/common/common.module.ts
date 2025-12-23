/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Utils } from './utils/utils';

@Module({
    providers: [Utils],
    exports: [Utils]
})
export class CommonModule {}
