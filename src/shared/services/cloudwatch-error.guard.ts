import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import { createMethodDecorator, MiddlewareFn } from 'type-graphql';

import { Context } from '../../core/types/context';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import knex from '../../knex';
import { container } from '../../inversify.config';
import { WinstonService } from './winston.service';
import Redis from 'ioredis';

// const redisPubSub = new Redis(
//   `redis://${process.env.LOGGER_REDIS_HOST}:${process.env.LOGGER_REDIS_PORT}`,
// );

export function CloudWatchLog(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    try {
      return await next();
    } catch (error) {
      // const dataLog = {
      //   time: Date.now(),
      //   name: 'api-error',
      //   data: {
      //     args: args,
      //     context: context,
      //   },
      // };
      // console.log('dataLog', dataLog);

      // const _ = redisPubSub.publish(
      //   process.env.LOGGER_REDIS_CHANNEL,
      //   JSON.stringify(dataLog),
      // );

      container.get(WinstonService).logger.error(error.message, {
        error,
      });
      throw error;
    }
  });
}
