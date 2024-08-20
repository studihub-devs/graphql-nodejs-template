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
import { CourseReview } from '../entities/course-review.entity';
import { CreateCourseReviewInput } from '../types/course-review-create.input';
import { CourseReviewError } from '../types/course-review-error';
import { CourseReviewWhereInput } from '../types/course-review-where.input';
import { CourseReviewArgs } from '../types/course-review.args';

@injectable()
export class CourseReviewService extends BaseService<CourseReview> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = CourseReview;
    this.transformFields = {
      user: 'user_id',
      courseId: 'course_id',
      createdAt: 'created_at',
    };
  }

  async create(
    data: CreateCourseReviewInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<CourseReview | CourseReviewError | CommonError> {
    // Validate the rate value
    if (data.rate < 1 || data.rate > 5) {
      throw ErrorFactory.createUserInputError(
        'Invalid rate value. Rate must be between 1 and 5.',
      );
    }

    try {
      // Insert a new record or update the existing one on conflict
      const result = await writer.transaction(async trx => {
        const insertData: any = {
          user_id: ctx.user?.id,
          course_id: data.courseId,
          rate: data.rate,
          created_at: new Date(),
          content: data.content || null, // Handle optional content
        };

        const insertedRows = await trx
          .from('studihub.course_review')
          .insert(insertData)
          .onConflict(['user_id', 'course_id'])
          .merge({
            rate: data.rate,
            content: data.content || null,
            created_at: new Date(),
          })
          .returning(this.getFieldList(info));

        return plainToClass(CourseReview, insertedRows[0]);
      });

      return result;
    } catch (e) {
      throw ErrorFactory.createInternalServerError();
    }
  }

  async getOne(
    where: CourseReviewWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<CourseReview> {
    return knex
      .from('studihub.course_review')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(CourseReview, row));
  }

  async getMany(
    args: CourseReviewArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<CourseReview[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(CourseReview, row)),
    );
  }

  async getCount(args: CourseReviewArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilder(
    args: CourseReviewArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ cc: 'studihub.course_review' });

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

    if (args.where?.rate) {
      qb.andWhere('cc.rate', 'ilike', `%${args.where?.rate}%`);
    }

    if (args.where?.content) {
      qb.andWhere('cc.content', 'ilike', `%${args.where?.content}%`);
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            CourseReview,
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
