/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInDto {
    @ApiProperty({
        example: 'donslice6@gmail.com',
        description: 'User\'s verified email'
    })
    @IsString()
    email: string;

    @ApiProperty({
        example: 'password',
        description: 'User\'s password'
    })
    @IsString()
    password: string;
}