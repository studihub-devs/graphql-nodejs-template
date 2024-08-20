import 'reflect-metadata';
import { container } from './inversify.config';
import { ApolloServer } from 'apollo-server-express';
import { RedisCache } from 'apollo-server-cache-redis';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import cluster from 'cluster';
import { cpus } from 'os';

import { Context } from './core/types/context';
import { User } from './user/entities/user.entity';
import { initApp } from './app';
import { Application } from 'express';
import { WinstonService } from './shared/services/winston.service';

import { loggingMobilePlugin } from './logger';
import { buildAppSchema } from './builder';

export async function buildApp(): Promise<Application> {
  const schema = await buildAppSchema();

  const server = new ApolloServer({
    schema,
    playground: JSON.parse(process.env.SERVER_PLAYGROUND),
    debug: JSON.parse(process.env.SERVER_DEBUG),
    introspection: true,
    tracing: JSON.parse(process.env.SERVER_TRACING),
    context: ({ req }): Context => {
      const ctx: Context = {
        user: req['user'] as User,
        acceptVersion: req.get('Accept-version'),
        deviceToken: req.get('Device-Token'),
        req,
      };
      return ctx;
    },
    cache: new RedisCache({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PWD,
      tls: process.env.REDIS_TLS ? {} : null,
    }),
    plugins: [loggingMobilePlugin, responseCachePlugin()],
    formatError: error => {
      container.get(WinstonService).logger.error(error.message, {
        error,
      });
      // database error
      if (error.extensions?.exception?.severity) {
        return new Error('Internal server error');
      }
      return error;
    },
  });
  const app = initApp();
  await server.start();

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    },
  });
  return app;
}

async function bootstrap(): Promise<void> {
  const mobileApp = await buildApp();

  mobileApp.listen(3000, '0.0.0.0', () => {
    console.log(`🚀 GraphQL server ready at http://0.0.0.0:3000/graphql`);
  });
}

if (process.env.NODE_ENV === 'development') {
  bootstrap();
} else if (process.env.NODE_ENV === 'production') {
  if (cluster.isMaster) {
    for (let i = 0; i < cpus().length; i++) {
      cluster.fork();
    }
    cluster.on('exit', function(worker, code, signal) {
      console.log(
        'Worker %d died with code/signal %s. Restarting worker...',
        worker.process.pid,
        signal || code,
      );
      cluster.fork();
    });
  } else {
    bootstrap();
  }
}
