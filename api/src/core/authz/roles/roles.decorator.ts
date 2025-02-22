import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/core/constants';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
