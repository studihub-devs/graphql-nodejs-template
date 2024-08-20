import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';

import { BaseService } from '../../core/services/base.service';
import { CacheService } from '../../shared/services/cache.service';
import { Context } from '../../core/types/context';
import { plainToClass } from 'class-transformer';
import knex, { writer } from '../../knex';
import { UserCourse } from '../entities/user-course.entity';
import { CreateUserCourseInput } from '../types/user-course-create.input';
import { UserCourseOrError } from '../types/user-course-or-error';
import { ErrorFactory } from '../../core/services/error-factory';

@injectable()
export class UserCourseService extends BaseService<UserCourse> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = UserCourse;
    this.transformFields = {};
  }

  async create(
    data: CreateUserCourseInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof UserCourseOrError> {
    return writer.transaction(async trx => {
      const result = await trx
        .from('studihub.user_course')
        .insert({
          user_id: ctx.user?.id,
          course_id: data.courseId,
          joinning_time: new Date(),
        })
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(UserCourse, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });
      return result;
    });
  }
}
