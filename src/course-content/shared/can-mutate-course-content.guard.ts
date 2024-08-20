import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { createMethodDecorator } from 'type-graphql';

import { ErrorFactory } from '../../core/services/error-factory';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import knex from '../../knex';
import { CourseContent } from '../entities/course-content.entity';
import { CourseContentError } from '../types/course-content-error';
import { CourseContentErrorCode } from '../types/course-content-error-code';
import { CourseContentStatus } from '../types/course-content-status';

export function CanMutateCourseContent(): MethodDecorator {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    if(context.user?.roleId.toString() == process.env.ADMIN_ROLE) {
      return next();
    }
    if(process.env.TEACHER_ROLE == context.user?.roleId.toString()) {
      if(args?.where?.id) {
        const [error, courseContent] = await to(
          knex
            .from({ cc: 'studihub.course_content' })
            .innerJoin({ c: 'studihub.course' }, 'cc.course_id', 'c.id')
            .andWhere('cc.id', args.where.id)
            .andWhere('c.teacher_id', context.user?.id)
            .andWhere('cc.status', CourseContentStatus.CREATED )
            .select('cc.id')
            .first()
            .then(row => plainToClass(CourseContent, row)),
        );

        if(error) {
          return ErrorFactory.createInternalServerError();
        }

        if(courseContent) {
          return next();
        }
      }
      return next();
    }

    return new CourseContentError({
      message: 'You can not mutate this course content',
      code: CourseContentErrorCode.CAN_NOT_MUTATE_COURSE_CONTENT,
      status: ErrorStatus.FORBIDDEN,
    });
  });
}
