import { PartialType } from '@nestjs/mapped-types';
import { CreateSupabaseDto } from './create-supabase.dto';

export class UpdateSupabaseDto extends PartialType(CreateSupabaseDto) {}
