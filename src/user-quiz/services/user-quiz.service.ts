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

import { UserQuiz } from '../entities/user-quiz.entity';
import { UserQuizWhereInput } from '../types/user-quiz-where.input';
import { UserQuizArgs } from '../types/user-quiz.args';
import { UserQuizRelayConnection } from '../types/user-quiz.relay-connection';
import { InsertUserQuizInput } from '../types/insert-user-quiz.input';
import { UserQuizOrError } from '../types/user-quiz-or-error';
import { UserQuizStatus } from '../types/user-quiz-status';

@injectable()
export class UserQuizService extends BaseService<UserQuiz> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = UserQuiz;
    this.transformFields = { 
      learner: 'user_id',
      quiz: 'quiz_id',    
    };
  }

  async getOne(
    where: UserQuizWhereInput, 
    info: GraphQLResolveInfo
  ): Promise<UserQuiz> {
    return knex
      .from('studihub.user_quiz_history')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(UserQuiz, row));
  }

  async getMany(
    args: UserQuizArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<UserQuiz[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(UserQuiz, row)),
    );
  }

  async getManyRelay(
    args: UserQuizArgs,
    ctx?: Context,
  ): Promise<UserQuizRelayConnection> {
    const totalCount = await this.getCount(args);

    // Set a default orderBy if not provided, to ensure proper sorting
    if (!args.after && !args.before && !args.orderBy) {
      args.orderBy = { id: OrderBy.ASC }; // Default ordering by 'id'
    }

    const quizzes = await this.createQueryBuilderCursor(args, ctx).then(rows =>
      rows.map(row => plainToClass(UserQuiz, row)),
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

    return plainToClass(UserQuizRelayConnection, {
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


  async getCount(args: UserQuizArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilderCursor(args: UserQuizArgs, ctx?: Context): Knex.QueryBuilder {
    const qb = this.createQueryBuilder(args)
      .clear('select')
      .clear('limit')
      .clear('offset');

    const fieldsList = args.orderBy
      ? Object.keys(args.orderBy).map(
          key => `uq.${
            classTransformerDefaultMetadataStorage.findExposeMetadata(
              UserQuiz,
              key,
            )?.options?.name || key }`,
        )
      : ['uq.id']; // Select id field if no orderBy is provided

    qb.select(fieldsList);

    return qb;
  }

  createQueryBuilder(
    args: UserQuizArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ uq: 'studihub.user_quiz_history' });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('uq.id', args.where?.id);
    }

    if (args.where?.quizId) {
      qb.andWhere('uq.quiz_id', args.where?.quizId);
    }   
    
    if (args.where?.userId) {
      qb.andWhere('uq.user_id', args.where?.userId);
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
        qb.orderBy(`uq.${
          classTransformerDefaultMetadataStorage.findExposeMetadata(UserQuiz, key)
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
    data: InsertUserQuizInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof UserQuizOrError> {
    return writer.transaction(async trx => {
      const result = await trx
        .from('studihub.user_quiz_history')
        .insert({
          user_id: ctx.user?.id,
          quiz_id: data.quizId, 
          started_at: new Date(),
          status: UserQuizStatus.STARTED,         
        })
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(UserQuiz, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });
      return result;
    });
  }
}
