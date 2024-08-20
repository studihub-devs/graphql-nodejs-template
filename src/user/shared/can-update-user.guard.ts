import { ForbiddenError } from 'apollo-server';
import { createMethodDecorator } from 'type-graphql';

import { Context } from '../../core/types/context';

export function CanMutateUser(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    if (context.user.id !== args.where.id) {
      throw new ForbiddenError(
        `You don't have permissions to update this user`,
      );
    }
    return next();
  });
}
