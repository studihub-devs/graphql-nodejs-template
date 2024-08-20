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

import { CourseAttachFile } from '../entities/course-attach-file.entity';
import { CourseAttachFileWhereInput } from '../types/course-attach-file-where.input';
import { CourseAttachFileArgs } from '../types/course-attach-file.args';

@injectable()
export class CourseAttachFileService extends BaseService<CourseAttachFile> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = CourseAttachFile;
  }

  async getOne(
    where: CourseAttachFileWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<CourseAttachFile> {
    return knex
      .from('studihub.course_attach_file')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(CourseAttachFile, row));
  }

  async getMany(
    args: CourseAttachFileArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<CourseAttachFile[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(CourseAttachFile, row)),
    );
  }

  async getCount(args: CourseAttachFileArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilder(
    args: CourseAttachFileArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ caf: 'studihub.course_attach_file' });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('caf.id', args.where?.id);
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            CourseAttachFile,
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
