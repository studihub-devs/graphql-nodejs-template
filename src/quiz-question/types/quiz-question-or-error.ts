import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { QuizQuestionError } from './quiz-question-error';

export const QuizQuestionOrError = createUnionType({
  name: 'QuizQuestionOrError',
  types: () => [QuizQuestion, QuizQuestionError, CommonError],
});
