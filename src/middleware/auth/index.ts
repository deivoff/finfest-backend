import jwt from 'jsonwebtoken';
import { Context } from '$types/index';
import { DecodedToken } from '$components/auth';
import { AuthChecker } from 'type-graphql';

import CONFIG from '$configs/index';

export const isAuth = async (ctx: Context, next: () => Promise<any>) => {
  const authHeader = ctx.header.authorization;
  if (!authHeader) {
    ctx.state.isAuth = false;
    return await next();
  }

  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    ctx.state.isAuth = false;
    return await next();
  }
  let decodedToken: string | object;
  try {
    decodedToken = jwt.verify(token, CONFIG.secretKey!);
  } catch {
    ctx.state.isAuth = false;
    return await next();
  }

  if (!decodedToken) {
    ctx.state.isAuth = false;
    return await next();
  }

  ctx.state.isAuth = true;
  ctx.state.decodedUser = decodedToken as DecodedToken;
  return await next();
};

export const authChecker: AuthChecker<Context> = ({ context: { state } }) => {
  return Boolean(state.isAuth);
};
