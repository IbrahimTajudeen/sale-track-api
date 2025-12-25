/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';
import { SignInDto } from './dto/signin.dto';

@ApiTags('Auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign\'s up a user into the system' })
  @ApiResponse({ type: SaleTrackApiResponse<any>, status: 201, description: 'An activation link has been sent to <user email>' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ type: SignUpDto, description: 'Sign up payload' })
  @Post('signup')
  async signUp(@Body() dto: SignUpDto): Promise<SaleTrackApiResponse<any>> {
    const result = await this.authService.signUp(dto);
    return result;
  }

  @ApiOperation({ summary: 'Sign\'s in a user into the system' })
  @ApiResponse({ type: SaleTrackApiResponse<any>, status: 201, description: 'Login successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ type: SignInDto, description: 'Sign in payload' })
  @Post('signin')
  async signin(@Body() dto: SignInDto): Promise<SaleTrackApiResponse<any>> {
    const result = await this.authService.signIn(dto);
    return result;
  }
}
