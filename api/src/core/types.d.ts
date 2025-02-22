import { Request } from 'express';
import { User } from 'src/core/schemas/user.schema';

export type RequestWithPrincipal = Request & { user: User };
