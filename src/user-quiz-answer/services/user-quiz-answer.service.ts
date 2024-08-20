import { injectable } from 'inversify';
import { GraphQLResolveInfo } from 'graphql';
import { plainToClass } from 'class-transformer';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { Knex } from 'knex';
import _ from 'lodash';
import { BaseService } from '../../core/services/base.service';
import { CacheService } from '../../shared/services/cache.service';
import { Context } from '../../core/types/context';
import knex, { writer } from '../../knex';
import { OrderBy } from '../../shared/types/order-by';
import { encodeCursor, paginate } from '../../utils/cursor-buffer';
import { ErrorFactory } from '../../core/services/error-factory';

import { UserQuizAnswer } from '../entities/user-quiz-answer.entity';
import { UserQuizAnswerWhereInput } from '../types/user-quiz-answer-where.input';
import { UserQuizAnswerArgs } from '../types/user-quiz-answer.args';
import { UserQuizAnswerRelayConnection } from '../types/user-quiz-answer.relay-connection';
import { InsertUserQuizAnswerInput } from '../types/insert-user-quiz-answer.input';
import { UserQuizAnswerOrError } from '../types/user-quiz-answer-or-error';

@injectable()
export class UserQuizAnswerService extends BaseService<UserQuizAnswer> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = UserQuizAnswer;
    this.transformFields = { };
  }

  async getOne(
    where: UserQuizAnswerWhereInput, 
    info: GraphQLResolveInfo
  ): Promise<UserQuizAnswer> {
    return knex
      .from('studihub.user_quiz_answer')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(UserQuizAnswer, row));
  }

  async getMany(
    args: UserQuizAnswerArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<UserQuizAnswer[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(UserQuizAnswer, row)),
    );
  }

  async getManyRelay(
    args: UserQuizAnswerArgs,
    ctx?: Context,
  ): Promise<UserQuizAnswerRelayConnection> {
    const totalCount = await this.getCount(args);

    // Set a default orderBy if not provided, to ensure proper sorting
    if (!args.after && !args.before && !args.orderBy) {
      args.orderBy = { id: OrderBy.ASC }; // Default ordering by 'id'
    }

    const quizzes = await this.createQueryBuilderCursor(args, ctx).then(rows =>
      rows.map(row => plainToClass(UserQuizAnswer, row)),
    );

    const paginatedCourses = paginate(
      quizzes,
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

    return plainToClass(UserQuizAnswerRelayConnection, {
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


  async getCount(args: UserQuizAnswerArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilderCursor(args: UserQuizAnswerArgs, ctx?: Context): Knex.QueryBuilder {
    const qb = this.createQueryBuilder(args)
      .clear('select')
      .clear('limit')
      .clear('offset');

    const fieldsList = args.orderBy
      ? Object.keys(args.orderBy).map(
          key => `uqa.${
            classTransformerDefaultMetadataStorage.findExposeMetadata(
              UserQuizAnswer,
              key,
            )?.options?.name || key }`,
        )
      : ['uqa.id']; // Select id field if no orderBy is provided

    qb.select(fieldsList);

    return qb;
  }

  createQueryBuilder(
    args: UserQuizAnswerArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ uqa: 'studihub.user_quiz_answer' });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('uqa.id', args.where?.id);
    }

    if (args.where?.userQuizId) {
      qb.andWhere('uqa.user_quiz_id', args.where?.userQuizId);
    }   
    
    if (args.where?.userId) {
      qb.andWhere('uqa.user_id', args.where?.userId);
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
        qb.orderBy(`uqa.${
          classTransformerDefaultMetadataStorage.findExposeMetadata(UserQuizAnswer, key)
            ?.options?.name || key }`,
          value,
        );
      });
    }

    if (args.skip) {
      qb.offset(args.skip);
    }

    // Limit results based on first or last
    if (args.first) {
      qb.limit(args.first);
    } else if (args.last) {
      qb.limit(args.last);
    }

    return qb;
  }

  async create(
    data: InsertUserQuizAnswerInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof UserQuizAnswerOrError> {
    return writer.transaction(async trx => {
      const result = await trx
        .from('studihub.user_quiz_answer')
        .insert({
          user_id: ctx.user?.id,         
          started_at: new Date(),             
        })
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(UserQuizAnswer, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });
      return result;
    });
  }
}
