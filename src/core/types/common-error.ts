import { Field, ObjectType } from 'type-graphql';

import { CommonErrorCode } from './common-error-code';
import { Error } from './error';
import { ErrorStatus } from './error-status';

@ObjectType({ implements: Error })
export class CommonError implements Error {
  message: string;

  status: ErrorStatus;

  @Field(() => CommonErrorCode)
  code: CommonErrorCode;
}
