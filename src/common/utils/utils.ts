/* eslint-disable prettier/prettier */
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class Utils {
    roundUpToHundred(num: number): number {
        return Math.ceil(num / 100) * 100;
    }
    
    applyFilters(query: any, /* PostgrestFilterBuilder<any, any, any, any>, */filters: Record<string, any>,): any {
        
        const ignoredKeys = ['page', 'limit', 'search'];
  
        for (const key in filters) {
            const value = filters[key];
    
            if (!value || ignoredKeys.includes(key)) continue;
            
            if(key === 'created_at')
            {
                query = query.gte('created_at', value);
                // query = query.lte('created_at', value);
               continue; 
            }

            if(key === 'updated_at')
            {
                query = query.gte('updated_at', value);
                // query = query.lte('updated_at', value);
               continue; 
            }

            // Support comma-separated values => IN filter
            if (typeof value === 'string' && value.includes(',')) {
                query = query.in(key, value.split(','));
                continue;
            }
            // Default = equality filter
            query = query.ilike(key, `%${value}%`);
        }
        // Optional search filter (example)
        // if (filters.search) {
        //     query = query.ilike('name', `%${filters.search}%`);
        // }
  
        return query;
    }

    supabaseBucketPathBuilder(
        userId: string,
        category: "receipts" | "invoices" | "statements",
        fileName: string)
    {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");

        return `users/${userId}/documents/${category}/${year}/${month}/${fileName}`;
    }

    generateShortGuid = (): string => uuidv4().split('-')[0];
    generateRequestId = (id: string): string => `SCORCHE-PAY-${id}-${this.generateShortGuid().toUpperCase()}-${Date.now()}`;

}