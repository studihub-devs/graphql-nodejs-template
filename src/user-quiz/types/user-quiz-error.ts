import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { UserQuizErrorCode } from './user-quiz-error-code';

@ObjectType({ implements: Error })
export class UserQuizError implements Error {
  constructor(options: Partial<UserQuizError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => UserQuizErrorCode)
  code: UserQuizErrorCode;
}
