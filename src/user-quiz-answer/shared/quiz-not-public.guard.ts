import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { createMethodDecorator } from 'type-graphql';

import { ErrorFactory } from '../../core/services/error-factory';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import knex from '../../knex';
import { QuizStatus } from '../../quiz/types/quiz-status';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { UserQuizAnswerError } from '../types/user-quiz-answer-error';
import { UserQuizAnswerErrorCode } from '../types/user-quiz-answer-error-code';

export function QuizNotPublic(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    const [error, quiz] = await to(
      knex
        .from({uqa: 'studihub.user_quiz_answer'})
        .innerJoin({ uq: 'studihub.user_quiz_history'}, 'uq.id', 'uqa.user_quiz_id')
        .innerJoin({ q: 'studihub.quiz'}, 'q.id', 'uq.quiz_id')
        .andWhere({ 'uqa.id': args.data.user_quiz_id })
        .andWhere('q.status', QuizStatus.APPROVED)        
        .first()
        .then(row => plainToClass(Quiz, row)),
    );
    // check if test time out of. 
    if (error) {
      return ErrorFactory.createInternalServerError();
    }

    if (!quiz) {
      return new UserQuizAnswerError({
        message: 'Quiz not public',
        code: UserQuizAnswerErrorCode.QUIZ_NOT_PUBLIC,
        status: ErrorStatus.FORBIDDEN,
      });
    }

    return next();
  });
}
