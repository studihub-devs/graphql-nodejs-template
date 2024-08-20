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
import { CourseViewership } from '../entities/course-viewership.entity';
import { CreateCourseViewershipInput } from '../types/course-viewership-create.input';
import { CourseViewershipError } from '../types/course-viewership-error';
import { CourseViewershipWhereInput } from '../types/course-viewership-where.input';
import { CourseViewershipArgs } from '../types/course-viewership.args';

@injectable()
export class CourseViewershipService extends BaseService<CourseViewership> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = CourseViewership;
    this.transformFields = {
      user: 'user_id',
      courseId: 'course_id',
      createdAt: 'created_at',
    };
  }

  async create(
    data: CreateCourseViewershipInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<CourseViewership | CourseViewershipError | CommonError> {
    // Validate the power value
    if (data.power && data.power < 1) {
      throw ErrorFactory.createUserInputError(
        'Invalid power value. power must be greater than 0!',
      );
    }

    try {
      // Insert a new record or update the existing one on conflict
      const result = await writer.transaction(async trx => {
        const insertData: any = {
          user_id: ctx.user?.id,
          course_id: data.courseId,
          power: data.power,
          created_at: new Date(),
          device_id: data.deviceId || null, // Handle optional deviceId
        };

        const insertedRows = await trx
          .from('studihub.course_viewership')
          .insert(insertData)
          .onConflict(['user_id', 'course_id'])
          .merge({
            power: data.power,
            created_at: new Date(),
          })
          .returning(this.getFieldList(info));

        return plainToClass(CourseViewership, insertedRows[0]);
      });

      return result;
    } catch (e) {
      throw ErrorFactory.createInternalServerError();
    }
  }

  async getOne(
    where: CourseViewershipWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<CourseViewership> {
    return knex
      .from('studihub.course_viewership')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(CourseViewership, row));
  }

  async getMany(
    args: CourseViewershipArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<CourseViewership[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(CourseViewership, row)),
    );
  }

  async getCount(args: CourseViewershipArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilder(
    args: CourseViewershipArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ cc: 'studihub.course_viewership' });

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

    if (args.where?.power) {
      qb.andWhere('cc.power', 'ilike', `%${args.where?.power}%`);
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            CourseViewership,
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
