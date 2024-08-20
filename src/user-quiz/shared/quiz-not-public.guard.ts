import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { createMethodDecorator } from 'type-graphql';

import { ErrorFactory } from '../../core/services/error-factory';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import knex from '../../knex';
import { QuizStatus } from '../../quiz/types/quiz-status';
import { UserQuizError } from '../types/user-quiz-error';
import { UserQuizErrorCode } from '../types/user-quiz-error-code';
import { Quiz } from '../../quiz/entities/quiz.entity';

export function QuizNotPublic(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    const [error, quiz] = await to(
      knex
        .from('studihub.quiz')
        .andWhere({ id: args.data.quizId })
        .andWhere('status', QuizStatus.APPROVED)        
        .first()
        .then(row => plainToClass(Quiz, row)),
    );
    if (error) {
      return ErrorFactory.createInternalServerError();
    }

    if (!quiz) {
      return new UserQuizError({
        message: 'Quiz not public',
        code: UserQuizErrorCode.QUIZ_NOT_PUBLIC,
        status: ErrorStatus.FORBIDDEN,
      });
    }

    return next();
  });
}
