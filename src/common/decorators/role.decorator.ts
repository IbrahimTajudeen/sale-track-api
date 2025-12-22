/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/types/user-role.types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);