/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";


export class SignUpDto {
    @ApiProperty({
        example: 'donslice6@gmail.com',
        description: 'User verified signin email'
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Ibrahim',
        description: 'User\'s first name'
    })
    @IsString()
    firstname: string;

    @ApiProperty({
        example: 'Tajudeen',
        description: 'User\s last name'
    })
    @IsString()
    lastname: string;

    @ApiProperty({
        example: '', // 'courtyard-32xcGdxuqw',
        description: 'An optional code that suggest the level of user Role'
    })
    @IsString()
    @IsOptional()
    authCode: string;

    @ApiProperty({
        example: 'NexoCode',
        description: 'A Unique username for the newly created user'
    })
    @IsString()
    username: string;

    @ApiProperty({
        example: '08132166576',
        description: 'User\s phone number'
    })
    @IsString()
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({
        description: 'User password',
        example: 'password'
    })
    @IsString()
    password: string;
}