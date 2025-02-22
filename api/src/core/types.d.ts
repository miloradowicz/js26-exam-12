import { Request } from 'express';
import { User } from 'src/core/user/user.schema';

export type RequestWithPrincipal = Request & { user: User };
