/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  Logger, 
  UnauthorizedException,
  ForbiddenException,
  BadRequestException
 } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SignUpDto } from './dto/index.dto';
import { UserRole } from 'src/common/types/user-role.type';
import { SaleTrackApiResponse } from 'src/common/utils/api-response.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly supabase: SupabaseService) {}
  
  async signUp(signUpDto: SignUpDto): Promise<SaleTrackApiResponse<any>> {
    try{
      if(signUpDto.authCode && signUpDto.authCode !== 'something') {
        this.logger.error('Bad auth code');
        throw new BadRequestException('Invalid auth code')
      }

      const role = (signUpDto.authCode && signUpDto.authCode == 'something') ? UserRole.BOSS :  UserRole.USER;

      const { error } = await this.supabase.adminClient()
        .auth.signUp({
          email: signUpDto.email,
          password: signUpDto.password,
          options: {
            data: {
              username: signUpDto.username,
              firstname: signUpDto.firstname,
              lastname: signUpDto.lastname,
              phone: signUpDto.phone,
              role: role,
            }
          }
        });

      // ✅ Better error logging
      if (error) {
        this.logger.error('Supabase Auth Error Details:', {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack
        });
        throw new UnauthorizedException(`An error occured`);
      }

      this.logger.log('Auth user created successfully:');
      
      return {
        success: true,
        data: null,
        message: `An activation link has been sent to ${signUpDto.email}`
      };
    } catch (error) {
      throw error;
    }
  }

    async signIn(email: string, password: string): Promise<SaleTrackApiResponse<any>> {
      try{
        const { data, error } = await this.supabase.client()
        .auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw new UnauthorizedException(error.message);
    
        return {
          success: true,
          data: {
            ...data
          },
          message: 'Login successfully'
        };
      } catch (error) {
        throw error;
      }
    }
  

}
