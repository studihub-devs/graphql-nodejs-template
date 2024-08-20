import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { AuthError } from './auth-error';
import { UserAuthPayload } from './user-auth-payload';

export const AuthPayloadOrError = createUnionType({
  name: 'AuthPayloadOrError',
  types: () => [UserAuthPayload, AuthError, CommonError],
});
