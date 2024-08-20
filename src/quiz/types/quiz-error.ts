import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { QuizErrorCode } from './quiz-error-code';

@ObjectType({ implements: Error })
export class QuizError implements Error {
  constructor(options: Partial<QuizError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => QuizErrorCode)
  code: QuizErrorCode;
}
