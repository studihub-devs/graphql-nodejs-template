import { createParamDecorator } from 'type-graphql';
import { Context } from '../types/context';

export function CurrentUser(): ParameterDecorator {
  return createParamDecorator<Context>(({ context }) => context.user);
}
