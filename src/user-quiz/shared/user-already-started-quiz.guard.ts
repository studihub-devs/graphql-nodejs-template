import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { createMethodDecorator } from 'type-graphql';

import { ErrorFactory } from '../../core/services/error-factory';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import knex from '../../knex';
import { UserQuiz } from '../entities/user-quiz.entity';
import { UserQuizError } from '../types/user-quiz-error';
import { UserQuizErrorCode } from '../types/user-quiz-error-code';

export function UserAlreadyStartedQuiz(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    const [error, userQuiz] = await to(
      knex
        .from('studihub.user_quiz_history')
        .andWhere({ quiz_id: args.data.quizId })
        .andWhere({ user_id: context.user?.id })
        .select('id')
        .first()
        .then(row => plainToClass(UserQuiz, row)),
    );
    if (error) {
      return ErrorFactory.createInternalServerError();
    }

    if (userQuiz) {
      return new UserQuizError({
        message: 'You already started this course',
        code: UserQuizErrorCode.YOU_ALREADY_STARTED_THIS_QUIZ,
        status: ErrorStatus.FORBIDDEN,
      });
    }

    return next();
  });
}
