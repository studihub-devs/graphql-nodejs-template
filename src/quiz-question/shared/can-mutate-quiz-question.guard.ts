import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { createMethodDecorator } from 'type-graphql';

import { ErrorFactory } from '../../core/services/error-factory';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import knex from '../../knex';
import { QuizStatus } from '../../quiz/types/quiz-status';
import { QuizQuestionError } from '../types/quiz-question-error';
import { QuizQuestionErrorCode } from '../types/quiz-question-error-code';
import { QuizQuestion } from '../entities/quiz-question.entity';

export function CanMutateQuizQuestion(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    if(context.user?.roleId.toString() == process.env.ADMIN_ROLE) {
      return next();
    }
    if(process.env.TEACHER_ROLE == context.user?.roleId.toString()) {
      if(args?.where?.id) {
        const [error, quizQuestion] = await to(
          knex
            .from({ qq: 'studihub.quiz_questions' })
            .innerJoin({ q: 'studihub.quiz' }, 'q.id', 'qq.quiz_id')
            .innerJoin({ cc: 'studihub.course_content' }, 'cc.id', 'q.course_content_id')
            .innerJoin({ c: 'studihub.course' }, 'cc.course_id', 'c.id')
            .andWhere('qq.id', args.where.id)
            .andWhere('c.teacher_id', context.user?.id)
            .andWhere('q.status', QuizStatus.CREATED )
            .select('qq.id')
            .first()
            .then(row => plainToClass(QuizQuestion, row))
        );
        

        if(error) {
          return ErrorFactory.createInternalServerError();
        }

        if(quizQuestion) {
          return next();
        }
      }
      return next();
    }

    return new QuizQuestionError({
      message: 'You can not mutate this quiz question',
      code: QuizQuestionErrorCode.CAN_NOT_MUTATE_QUIZ_QUESTION,
      status: ErrorStatus.FORBIDDEN,
    });
  });
}

