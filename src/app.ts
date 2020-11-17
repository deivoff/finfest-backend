import 'reflect-metadata';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import KoaRouter from '@koa/router';
import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';

import CONFIG from '$configs/index';

import { oauthHandler } from '$helpers/oauth';
import { ApolloContext, Context } from '$types/index';
import { authChecker, isAuth, TypegooseMiddleware } from '$middleware/index';
import { AuthResolvers } from '$components/auth';
import { UserResolvers } from '$components/user';
import { ChatResolver } from '$components/chat';
import { ReviewResolver } from '$components/review';
import { QuestionResolver } from '$components/question';
import { ProductResolver } from '$components/product';
import { VideoResolver } from '$components/video';


export const createApp = async () => {
  const app = new Koa();
  const router = new KoaRouter();

  // OAUTH
  router.get('/oauth/(.*)', oauthHandler);

  app.use(logger());
  app.use(isAuth);

  const schema = await buildSchema({
    resolvers: [
      AuthResolvers,
      UserResolvers,
      ChatResolver,
      ReviewResolver,
      QuestionResolver,
      ProductResolver,
      VideoResolver,
    ],
    emitSchemaFile: !CONFIG.isProd,
    validate: false,
    globalMiddlewares: [
      TypegooseMiddleware,
    ],
    authChecker,
  });

  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    ctx.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-Requested-With, x-access-token',
    );
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    if (ctx.method === 'OPTIONS') {
      return (ctx.status = 200);
    }

    await next();
  });

  const server = new ApolloServer({
    schema,
    context: ({ ctx: { request, state } }: { ctx: Context }): ApolloContext =>
      ({
        state,
        request,
        dataloaders: new WeakMap(),
      }),
    playground: true,
    introspection: true,
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  server.applyMiddleware({ app, path: '/graphql' });

  try {
    await mongoose.connect(`${CONFIG.dbUrl}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: CONFIG.dbName,
      user: CONFIG.dbUser,
      pass: CONFIG.dbPass,
    });
    CONFIG.env === ('development' || 'test') && mongoose.set('debug', true);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error);
  }

  return { app, schema };
};
