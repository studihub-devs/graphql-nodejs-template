import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { UserQuiz } from '../entities/user-quiz.entity';
import { UserQuizError } from './user-quiz-error';

export const UserQuizOrError = createUnionType({
  name: 'UserQuizOrError',
  types: () => [UserQuiz, UserQuizError, CommonError],
});
