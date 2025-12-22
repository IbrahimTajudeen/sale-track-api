/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */


// import { Injectable } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";
// import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export class SaleTrackApiResponse<T> {
    @ApiProperty({ example: true, description: 'Indicates if the request was successful' })
    success: boolean;
    @ApiProperty({ description: 'The data returned by the API' })
    data: T | null;
    @ApiProperty({ example: 'Request completed successfully', description: 'A message providing additional information about the response', required: false })
    message?: string;
}
