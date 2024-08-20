import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { createMethodDecorator } from 'type-graphql';

import { ErrorFactory } from '../../core/services/error-factory';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import knex from '../../knex';
import { UserCourseError } from '../types/user-course-error';
import { UserCourseErrorCode } from '../types/user-course-error-code';
import { UserCourse } from '../entities/user-course.entity';

export function UserAlreadyRegisteredCourse(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    const [error, userCourse] = await to(
      knex
        .from('studihub.user_course')
        .andWhere({ course_id: args.data.courseId })
        .andWhere({ user_id: context.user?.id })
        .select('id')
        .first()
        .then(row => plainToClass(UserCourse, row)),
    );
    if (error) {
      return ErrorFactory.createInternalServerError();
    }

    if (userCourse) {
      return new UserCourseError({
        message: 'You already registered this course',
        code: UserCourseErrorCode.YOU_ALREADY_REGISTERED_THIS_COURSE,
        status: ErrorStatus.FORBIDDEN,
      });
    }

    return next();
  });
}
