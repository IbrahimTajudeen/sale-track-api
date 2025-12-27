/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNumber, IsString, IsUUID } from "class-validator";

export class GeneratedReport {
    @ApiProperty({
        example: '9d7388d2-7a8e-402c-8251-681984e73ab1',
        description: 'The UUID of the user to create sale report for'
    })
    @IsUUID()
    user_id: string;

    @ApiProperty({
            example: '2024-06-01',
            description: 'The starting date to select sales record from'
        })
    @IsDate()
    start_date: Date;

    @ApiProperty({
        example: '2024-06-30',
        description: 'The ending date to select sales record to'
    })
    @IsDate()
    end_date: Date;

    @ApiProperty({
        description: 'The total amount sales made in the range'
    })
    @IsNumber()
    total_sales: number;

    @ApiProperty({
        description: 'The total number sales made in the range'
    })
    @IsNumber()
    total_items: number;

    @ApiProperty({
        description: 'Path to the Generated PDF in supabase storage'
    })
    @IsString()
    pdf_path: string;

    @ApiProperty({
        description: 'The total amount sales made in the range'
    })
    @IsEmail()
    sent_to_email: string | null;

    @ApiProperty({
        description: 'The time the mail was sent'
    })
    @IsDate()
    sent_at: Date | null;
}

