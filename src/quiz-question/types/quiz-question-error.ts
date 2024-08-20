import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { QuizQuestionErrorCode } from './quiz-question-error-code';

@ObjectType({ implements: Error })
export class QuizQuestionError implements Error {
  constructor(options: Partial<QuizQuestionError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => QuizQuestionErrorCode)
  code: QuizQuestionErrorCode;
}
