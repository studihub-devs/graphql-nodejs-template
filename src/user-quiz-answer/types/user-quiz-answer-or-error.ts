import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { UserQuizAnswer } from '../entities/user-quiz-answer.entity';
import { UserQuizAnswerError } from './user-quiz-answer-error';

export const UserQuizAnswerOrError = createUnionType({
  name: 'UserQuizAnswerOrError',
  types: () => [UserQuizAnswer, UserQuizAnswerError, CommonError],
});
