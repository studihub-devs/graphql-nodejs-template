import { injectable } from 'inversify';
import { GraphQLResolveInfo } from 'graphql';
import { plainToClass } from 'class-transformer';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { Knex } from 'knex';
import _ from 'lodash';
import { BaseService } from '../../core/services/base.service';
import { CacheService } from '../../shared/services/cache.service';
import { Context } from '../../core/types/context';
import knex from '../../knex';

import { CourseCategory } from '../entities/course-category.entity';
import { CourseCategoryWhereInput } from '../types/course-category-where.input';
import { CourseCategoryArgs } from '../types/course-category.args';

@injectable()
export class CourseCategoryService extends BaseService<CourseCategory> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = CourseCategory;
  }

  async getOne(
    where: CourseCategoryWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<CourseCategory> {
    return knex
      .from('studihub.course_category')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(CourseCategory, row));
  }

  async getMany(
    args: CourseCategoryArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<CourseCategory[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(CourseCategory, row)),
    );
  }

  async getCount(args: CourseCategoryArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilder(
    args: CourseCategoryArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ cc: 'studihub.course_category' });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('cc.id', args.where?.id);
    }

    // if (args.where?.parentIdFilter?.equals) {
    //   qb.andWhere('cc.id', args.where?.parentIdFilter?.equals);
    // }

    // if (args.where?.parentIdFilter?.in) {
    //     qb.andWhere('cc.category_id', args.where?.parentIdFilter?.equals);
    // }

    if (args.where?.name) {
      qb.andWhere('cc.name', 'ilike', `%${args.where?.name}%`);
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            CourseCategory,
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
