import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { Quiz } from '../entities/quiz.entity';
import { QuizError } from './quiz-error';

export const QuizOrError = createUnionType({
  name: 'QuizOrError',
  types: () => [Quiz, QuizError, CommonError],
});
