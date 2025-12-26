/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { 
    IsDate,
    IsEmail,
    // IsString,
    // IsUUID
 } from "class-validator";

export class CreateReportDto {
    // @ApiProperty({
    //     example: '9d7388d2-7a8e-402c-8251-681984e73ab1',
    //     description: 'The UUID of the user to create sale report for'
    // })
    // @IsString()
    // @IsUUID()
    // userId: string;

    @ApiProperty({
        example: '2024-06-01',
        description: 'The starting date to select sales record from'
    })
    @IsDate()
    startDate: Date;

    @ApiProperty({
        example: '2024-06-30',
        description: 'The ending date to select sales record to'
    })
    @IsDate()
    endDate: Date;

    @ApiProperty({
        example: 'donslice6@gmail.com',
        description: 'The boss or admin email to'
    })
    @IsEmail()
    sendEmail: string;
}
