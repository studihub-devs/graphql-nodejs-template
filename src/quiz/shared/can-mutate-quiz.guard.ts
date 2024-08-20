import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { createMethodDecorator } from 'type-graphql';

import { ErrorFactory } from '../../core/services/error-factory';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import knex from '../../knex';
import { Quiz } from '../entities/quiz.entity';
import { QuizError } from '../types/quiz-error';
import { QuizErrorCode } from '../types/quiz-error-code';
import { QuizStatus } from '../types/quiz-status';

export function CanMutateQuiz(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    if(context.user?.roleId.toString() == process.env.ADMIN_ROLE) {
      return next();
    }
    if(process.env.TEACHER_ROLE == context.user?.roleId.toString()) {
      if(args?.where?.id) {
        const [error, quiz] = await to(
          knex
            .from({ q: 'studihub.quiz' })
            .innerJoin({ cc: 'studihub.course_content' }, 'cc.id', 'q.course_content_id')
            .innerJoin({ c: 'studihub.course' }, 'cc.course_id', 'c.id')
            .andWhere('q.id', args.where.id)
            .andWhere('c.teacher_id', context.user?.id)
            .andWhere('q.status', QuizStatus.CREATED )
            .select('q.id')
            .first()
            .then(row => plainToClass(Quiz, row)),
        );

        if(error) {
          return ErrorFactory.createInternalServerError();
        }

        if(quiz) {
          return next();
        }
      }
      return next();
    }

    return new QuizError({
      message: 'You can not mutate this quiz',
      code: QuizErrorCode.CAN_NOT_MUTATE_QUIZ,
      status: ErrorStatus.FORBIDDEN,
    });
  });
}
