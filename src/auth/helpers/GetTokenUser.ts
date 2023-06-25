import { createParamDecorator } from '@nestjs/common';
import TokenUser from '../../models/TokenUser';

export const GetTokenUser = createParamDecorator(
  (data, req): TokenUser | null => req.args[0].user,
);