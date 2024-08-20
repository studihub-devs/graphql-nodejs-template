import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { createMethodDecorator } from 'type-graphql';

import { ErrorFactory } from '../../core/services/error-factory';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import knex from '../../knex';
import { Course } from '../entities/course.entity';
import { CourseError } from '../types/course-error';
import { CourseErrorCode } from '../types/course-error-code';
import { CourseStatus } from '../types/course-status';

export function CanMutateCourse(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    if (context.user?.roleId.toString() == process.env.ADMIN_ROLE) {
      return next();
    }
    if (process.env.TEACHER_ROLE == context.user?.roleId.toString()) {
      if (args?.where?.id) {
        const [error, course] = await to(
          knex
            .from('studihub.course')
            .andWhere({ id: args.where.id })
            .andWhere({ teacher_id: context.user?.id })
            .andWhere({ status: CourseStatus.CREATED })
            .select('id')
            .first()
            .then(row => plainToClass(Course, row)),
        );

        if (error) {
          return ErrorFactory.createInternalServerError();
        }

        if (course) {
          return next();
        }
      }
      return next();
    }

    return new CourseError({
      message: 'You can not mutate this course',
      code: CourseErrorCode.CAN_NOT_MUTATE_COURSE,
      status: ErrorStatus.FORBIDDEN,
    });
  });
}
