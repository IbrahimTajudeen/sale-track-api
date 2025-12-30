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
import { SignInDto, SignUpDto } from './dto/index.dto';
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

  async signIn(signIn: SignInDto): Promise<SaleTrackApiResponse<any>> {
    try{
      const { data, error } = await this.supabase.client()
      .auth.signInWithPassword({
        email: signIn.email,
        password: signIn.password,
      });

      if (error) throw new UnauthorizedException(error.message);

      const response = {
        email: data.user.user_metadata.email,
        firstName: data.user.user_metadata.firstname,
        lastName: data.user.user_metadata.lastname,
        phone: data.user.user_metadata.phone,
        role: data.user.user_metadata.role,
        username: data.user.user_metadata.username,
        session: {
          token: data.session.access_token,
          refreshToken: data.session.refresh_token
        }
      }
  
      return {
        success: true,
        data: {
          ...response
        },
        message: 'Login successfully'
      };
    } catch (error) {
      throw error;
    }
  }
  

}
