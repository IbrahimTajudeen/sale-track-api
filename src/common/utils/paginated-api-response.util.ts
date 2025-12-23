/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */


// import { Injectable } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";
// import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export class SaleTrackApiPaginatedResponse<T> {
    @ApiProperty({ example: true, description: 'Indicates if the request was successful' })
    success: boolean;

    @ApiProperty({ example: 'Request successfully executed', description: 'A message from the api' })
    message?: string = 'Request successfully executed'

    @ApiProperty({ description: 'The data returned by the API' })
    data: T[] | [] | null;

    @ApiProperty({ example: 1, description: 'The current page number' })
    currentPage: number;

    @ApiProperty({ example: 10, description: 'The number of items per page' })
    pageSize: number | null;

    @ApiProperty({ example: 100, description: 'The total number of items available' })
    totalItems: number | null;

    @ApiProperty({ example: 10, description: 'The total number of pages available' })
    totalPages: number | null;
}
