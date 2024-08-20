import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { CacheService } from '../../shared/services/cache.service';

import { BaseService } from '../../core/services/base.service';
import { S3File } from '../entities/s3-file.entity';
import { FixedSize } from '../types/fixed-size';
import { plainToClass } from 'class-transformer';
import { Knex } from 'knex';
import knex, { writer } from '../../knex';
import { S3FileArgs } from '../types/s3-file.args';
import { S3FileCreateInput } from '../types/create-s3-file.input';
import { S3FileWhereInput } from '../types/s3-file-where.input';
import { S3Service } from '../../shared/services/s3.service';
import { Context } from '../../core/types/context';
import { S3FileRelayConnection } from '../types/s3-file-relay.connection';
import { OrderBy } from '../../shared/types/order-by';
import { encodeCursor, paginate } from '../../utils/cursor-buffer';

@injectable()
export class S3FileService extends BaseService<S3File> {
  constructor(
    readonly cacheService: CacheService,
    private s3Service: S3Service,   
  ) {
    super(cacheService);
    this.type = S3File;
    this.transformFields = {};
    this.skipFields = ['fixed'];
  }

  getFieldList(
    info: GraphQLResolveInfo,
    options?: { prefix?: string; path?: string },
  ): string[] {
    const fields = super.getFieldList(info, options);
    this.skipFields.forEach(field => {
      fields.push(
        ...super.getFieldList(info, {
          ...options,
          path: field,
        }),
      );
    });
    return fields;
  }

  getFixedImage(image: S3File, fixedSize: FixedSize): S3File {
    const fixedImage = _.clone(image);
    fixedImage.width = fixedSize;
    fixedImage.height =
      (fixedImage.height * fixedSize) / fixedImage.width || undefined;
    if (fixedImage.url) {
      const lastIndex = fixedImage.url.lastIndexOf('.');
      fixedImage.url = `${fixedImage.url.slice(
        0,
        lastIndex,
      )}_${fixedSize}${fixedImage.url.slice(lastIndex)}`;
    }
    return fixedImage;
  }

  getFixedUrl(url: string, fixedSize: FixedSize): string {
    if (!url) {
      return url;
    }
    const lastIndex = url.lastIndexOf('.');
    return `${url.slice(0, lastIndex)}_${fixedSize}${url.slice(lastIndex)}`;
  }

  async delete(where: S3FileWhereInput): Promise<S3File> {
    const image = await this.deleteOne(where);
    if (image) {
      await this.s3Service.deleteObjects(
        [image.url],
        [FixedSize.SMALL, FixedSize.MEDIUM, FixedSize.LARGE],
      );
    }
    return image;
  }

  async getCount(args: S3FileArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  async getMany(args: S3FileArgs, info?: GraphQLResolveInfo): Promise<S3File[]> {
    
    return this.createQueryBuilder(args, this.getFieldList(info)).then(rows =>
      rows.map(row => plainToClass(S3File, row)),
    );
  }

  async getManyRelay(
    args: S3FileArgs,
    ctx?: Context,
  ): Promise<S3FileRelayConnection> {
    const totalCount = await this.getCount(args);

    // Set a default orderBy if not provided, to ensure proper sorting
    if (!args.after && !args.before && !args.orderBy) {
      args.orderBy = { id: OrderBy.ASC }; // Default ordering by 'id'
    }

    const s3Files = await this.createQueryBuilderCursor(args, ctx).then(rows =>
      rows.map(row => plainToClass( S3File, row)),
    );

    const paginatedCourses = paginate(
      s3Files,
      args.before,
      args.after,
      args.first,
      args.last,
    );

    // Map the results to edges and cursors
    const edges = paginatedCourses.map(it => {
      const currObject = args.orderBy ? { ...args.orderBy } : {};
      if (args.orderBy) {
        Object.keys(args.orderBy).forEach(key => {
          currObject[key] = it[key];
        });
      }
      return {
        node: it,
        cursor: args.orderBy ? encodeCursor(JSON.stringify(currObject)) : null,
      };
    });

    const hasNextPage = args.first && paginatedCourses.length === args.first;
    const hasPreviousPage = args.last && paginatedCourses.length === args.last;

    return plainToClass(S3FileRelayConnection, {
      totalCount,
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
    });
  } 
  
  createQueryBuilderCursor(args: S3FileArgs, ctx?: Context): Knex.QueryBuilder {
    const qb = this.createQueryBuilder(args)
      .clear('select')
      .clear('limit')
      .clear('offset');

    const fieldsList = args.orderBy
      ? Object.keys(args.orderBy).map(
          key =>
            classTransformerDefaultMetadataStorage.findExposeMetadata(
              S3File,
              key,
            )?.options?.name || key,
        )
      : ['id']; // Select id field if no orderBy is provided

    qb.select(fieldsList);

    return qb;
  }

  private createQueryBuilder(
    args: S3FileArgs,
    fields?: string[],
  ): Knex.QueryBuilder {
    const qb = knex.from({ sf: 'studihub.s3_file' });

    if (fields) {
      qb.select(fields);
    }  
    
    if (args.where?.fileType) {
      qb.andWhere('sf.type', args.where?.fileType);
    } 

    // Limit results based on first or last
    if (args.first) {
      qb.limit(args.first);
    } else if (args.last) {
      qb.limit(args.last);
    }

    if (args.skip) {
      qb.offset(args.skip);
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(S3File, key)
            ?.options?.name || key,
          value,
        );
      });
    } 

    // Set default orderBy if not provided
    if (!args.orderBy) {
      if (args.after) {
        args.orderBy = { id: OrderBy.ASC }; // Default to ASC if 'after' is used
      } else if (args.before) {
        args.orderBy = { id: OrderBy.DESC }; // Default to DESC if 'before' is used
      } else {
        args.orderBy = { id: OrderBy.ASC }; // Default to ASC if neither 'after' nor 'before' is used
      }
    }

    return qb;
  } 

  async createMany(
    data: S3FileCreateInput[],
    trx: Knex.Transaction,
  ): Promise<S3File[]> {
    return writer
      .from('studihub.s3_file')
      .insert(
        data.map(f => ({
          name: f.name,
          url: f.url,
          type: f.fileType,
          width: f.width,
          height: f.height,
        }))
      )
      .transacting(trx)     
      .returning('*')
      .then(rows => rows.map(row => plainToClass(S3File, row)));
  }  

  async deleteOne(where: S3FileWhereInput): Promise<S3File> {
    return writer
      .from('studihub.s3_file')
      .del()
      .where({ id: where.id })
      .returning('*')
      .then(rows => plainToClass(S3File, rows[0]));
  }

  async deleteMany(ids: string[], trx: Knex.Transaction): Promise<S3File[]> {
    return writer
      .from('studihub.s3_file')
      .del()
      .whereIn('id', ids)
      .returning('*')
      .transacting(trx)
      .then(rows => rows.map(row => plainToClass(S3File, row)));
  }
}
