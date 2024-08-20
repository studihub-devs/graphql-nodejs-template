import { plainToClass } from 'class-transformer';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import { Knex } from 'knex';
import _ from 'lodash';
import { BaseService } from '../../core/services/base.service';
import { Context } from '../../core/types/context';
import knex from '../../knex';
import { CacheService } from '../../shared/services/cache.service';

import { OrderBy } from '../../shared/types/order-by';
import { encodeCursor, paginate } from '../../utils/cursor-buffer';
import { News } from '../entities/news.entity';
import { NewsWhereInput } from '../types/news-where.input';
import { NewsArgs } from '../types/news.args';
import { NewsRelayConnection } from '../types/news.relay-connection';

@injectable()
export class NewsService extends BaseService<News> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = News;
    this.transformFields = {
      redirectLink: 'redirect_link',
      user: 'created_by',
      createdAt: 'created_at',
      hashTags: 'hash_tags',
    };
  }

  async getOne(where: NewsWhereInput, info: GraphQLResolveInfo): Promise<News> {
    return knex
      .from('studihub.news')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(News, row));
  }

  async getMany(
    args: NewsArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<News[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(News, row)),
    );
  }

  async getCount(args: NewsArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  async getManyRelayFormat(
    args: NewsArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<NewsRelayConnection> {
    const totalCount = await this.getCount(args);

    // Set a default orderBy if not provided, to ensure proper sorting
    if (!args.after && !args.before && !args.orderBy) {
      args.orderBy = { id: OrderBy.ASC }; // Default ordering by 'id'
    }

    // Retrieve the news records
    const news = (await this.createQueryBuilderCursor(
      args,
      info,
      ctx,
    ).then(rows => rows.map(row => plainToClass(News, row)))) as News[];

    // Perform pagination if applicable
    const paginatedNews = paginate(
      news,
      args.before,
      args.after,
      args.first,
      args.last,
    );

    // Map the results to edges and cursors
    const edges = paginatedNews.map(it => {
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

    const hasNextPage = args.first && paginatedNews.length === args.first;
    const hasPreviousPage = args.last && paginatedNews.length === args.last;

    return plainToClass(NewsRelayConnection, {
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

  createQueryBuilderCursor(
    args: NewsArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = this.createQueryBuilder(args, info, ctx)
      .clear('select')
      .clear('limit')
      .clear('offset');

    const fieldsList = args.orderBy
      ? Object.keys(args.orderBy).map(
          key =>
            classTransformerDefaultMetadataStorage.findExposeMetadata(News, key)
              ?.options?.name || key,
        )
      : ['id']; // Select id field if no orderBy is provided

    qb.select(fieldsList);

    return qb;
  }

  createQueryBuilder(
    args: NewsArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ c: 'studihub.news' });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('c.id', args.where?.id);
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

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(News, key)
            ?.options?.name || key,
          value,
        );
      });
    }

    if (args.skip) {
      qb.offset(args.skip);
    }

    if (args.first) {
      qb.limit(args.first);
    } else if (args.last) {
      qb.limit(args.last);
    }

    return qb;
  }
}
