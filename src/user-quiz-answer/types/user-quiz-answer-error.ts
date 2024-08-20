import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { UserQuizAnswerErrorCode } from './user-quiz-answer-error-code';

@ObjectType({ implements: Error })
export class UserQuizAnswerError implements Error {
  constructor(options: Partial<UserQuizAnswerError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => UserQuizAnswerErrorCode)
  code: UserQuizAnswerErrorCode;
}
