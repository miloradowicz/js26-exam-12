import { createParamDecorator } from '@nestjs/common';
import { RequestWithPrincipal } from 'src/core/types';

export const Principal = createParamDecorator((_, context) => {
  const request = context.switchToHttp().getRequest<RequestWithPrincipal>();

  return request.user;
});
