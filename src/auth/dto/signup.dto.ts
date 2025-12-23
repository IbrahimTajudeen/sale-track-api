import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class SignUpDto {
    @ApiProperty({
        example: 'donslice6@gmail.com',
        description: 'User verified signin email'
    })
    @IsString()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password'
    })
    @IsString()
    password: string;
}