import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { AuthErrorCode } from './auth-error-code';

@ObjectType({ implements: Error })
export class AuthError implements Error {
  constructor(options: Partial<AuthError>) {
    Object.assign(this, options);
  }

  message: string;

  status: ErrorStatus;

  @Field(() => AuthErrorCode)
  code: AuthErrorCode;
}
