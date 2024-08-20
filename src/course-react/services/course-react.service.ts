import { plainToClass } from 'class-transformer';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import { Knex } from 'knex';
import _ from 'lodash';
import { BaseService } from '../../core/services/base.service';
import { ErrorFactory } from '../../core/services/error-factory';
import { CommonError } from '../../core/types/common-error';
import { Context } from '../../core/types/context';
import knex, { writer } from '../../knex';
import { CacheService } from '../../shared/services/cache.service';
import { CourseReact } from '../entities/course-react.entity';
import { CreateCourseReactInput } from '../types/course-react-create.input';
import { CourseReactError } from '../types/course-react-error';
import { CourseReactWhereInput } from '../types/course-react-where.input';
import { CourseReactArgs } from '../types/course-react.args';
import { ReactType } from '../types/react-type';

@injectable()
export class CourseReactService extends BaseService<CourseReact> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = CourseReact;
    this.transformFields = {
      user: 'user_id',
      courseId: 'course_id',
      createdAt: 'created_at',
    };
  }

  async create(
    data: CreateCourseReactInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<CourseReact | CourseReactError | CommonError> {
    // Validate the reactType value
    if (
      data.reactType !== ReactType.LIKE &&
      data.reactType !== ReactType.BOOKMARK
    ) {
      throw ErrorFactory.createUserInputError(
        'Invalid reactType value. reactType must be either "like" or "bookmark".',
      );
    }

    try {
      // Insert a new record or update the existing one on conflict
      const result = await writer.transaction(async trx => {
        const insertData: any = {
          user_id: ctx.user?.id,
          course_id: data.courseId,
          react_type: data.reactType,
          created_at: new Date(),
          device_id: data.deviceId || null, // Handle optional deviceId
        };

        const insertedRows = await trx
          .from('studihub.course_react')
          .insert(insertData)
          .onConflict(['user_id', 'course_id', 'device_id', 'react_type'])
          .merge({
            created_at: new Date(),
            device_id: data.deviceId || null,
          })
          .returning(this.getFieldList(info));

        return plainToClass(CourseReact, insertedRows[0]);
      });

      return result;
    } catch (e) {
      throw ErrorFactory.createInternalServerError();
    }
  }

  async getOne(
    where: CourseReactWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<CourseReact> {
    return knex
      .from('studihub.course_react')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(CourseReact, row));
  }

  async getMany(
    args: CourseReactArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<CourseReact[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(CourseReact, row)),
    );
  }

  async getCount(args: CourseReactArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilder(
    args: CourseReactArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ cc: 'studihub.course_react' });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('cc.id', args.where?.id);
    }

    if (args.where?.courseId) {
      qb.andWhere('cc.course_id', 'ilike', `%${args.where?.courseId}%`);
    }

    if (args.where?.userId) {
      qb.andWhere('cc.user_id', 'ilike', `%${args.where?.userId}%`);
    }

    if (args.where?.deviceId) {
      qb.andWhere('cc.device_id', 'ilike', `%${args.where?.deviceId}%`);
    }

    if (args.where?.reactType) {
      qb.andWhere('cc.react_type', 'ilike', `%${args.where?.reactType}%`);
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            CourseReact,
            key,
          )?.options?.name || key,
          value,
        );
      });
    }

    if (args.skip) {
      qb.offset(args.skip);
    }

    if (args.first) {
      qb.limit(args.first);
    }

    return qb;
  }
}
