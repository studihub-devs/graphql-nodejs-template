import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { AuthError } from './auth-error';
import { UserCreateUserAuthPayload } from './user-create-user-auth-payload';

export const UserCreateUserAuthPayloadOrError = createUnionType({
  name: 'UserCreateUserAuthPayloadOrError',
  types: () => [UserCreateUserAuthPayload, AuthError, CommonError],
});
