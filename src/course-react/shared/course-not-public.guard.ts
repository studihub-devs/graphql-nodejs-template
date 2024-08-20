import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { createMethodDecorator } from 'type-graphql';

import { ErrorFactory } from '../../core/services/error-factory';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import { Course } from '../../course/entities/course.entity';
import { CourseStatus } from '../../course/types/course-status';
import knex from '../../knex';
import { CourseReactError } from '../types/course-react-error';
import { CourseReactErrorCode } from '../types/course-react-error-code';

export function CourseNotPublic(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    const [error, course] = await to(
      knex
        .from('studihub.course')
        .andWhere({ id: args.data.courseId })
        .andWhere('status', CourseStatus.APPROVED)
        .andWhereNot('teacher_id', context.user?.id)
        .select('id')
        .first()
        .then(row => plainToClass(Course, row)),
    );
    if (error) {
      return ErrorFactory.createInternalServerError();
    }

    if (!course) {
      return new CourseReactError({
        message: 'Course not public',
        code: CourseReactErrorCode.COURSE_NOT_PUBLIC,
        status: ErrorStatus.FORBIDDEN,
      });
    }

    return next();
  });
}
