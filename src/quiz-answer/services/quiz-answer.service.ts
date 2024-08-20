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
import { QuizAnswer } from '../entities/quiz-answer.entity';
import { QuizAnswerWhereInput } from '../types/quiz-answer-where.input';
import { QuizAnswerArgs } from '../types/quiz-answer.args';
import { QuizAnswerRelayConnection } from '../types/quiz-answer.relay-connection';
import { OrderBy } from '../../shared/types/order-by';
import { encodeCursor, paginate } from '../../utils/cursor-buffer';

@injectable()
export class QuizAnswerService extends BaseService<QuizAnswer> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = QuizAnswer;
    this.transformFields = {};
  }

  async getOne(
    where: QuizAnswerWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<QuizAnswer> {
    return knex
      .from('studihub.quiz_answers')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(QuizAnswer, row));
  }

  async getMany(
    args: QuizAnswerArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<QuizAnswer[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(QuizAnswer, row)),
    );
  }

  async getManyRelay(
    args: QuizAnswerArgs,
    ctx?: Context,
  ): Promise<QuizAnswerRelayConnection> {
    const totalCount = await this.getCount(args);

    // Set a default orderBy if not provided, to ensure proper sorting
    if (!args.after && !args.before && !args.orderBy) {
      args.orderBy = { id: OrderBy.ASC }; // Default ordering by 'id'
    }

    const quizAnswers = await this.createQueryBuilderCursor(args, ctx).then(rows =>
      rows.map(row => plainToClass(QuizAnswer, row)),
    );

    const paginatedCourses = paginate(
      quizAnswers,
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

    return plainToClass(QuizAnswerRelayConnection, {
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

  async getCount(args: QuizAnswerArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilderCursor(args: QuizAnswerArgs, ctx?: Context): Knex.QueryBuilder {
    const qb = this.createQueryBuilder(args)
      .clear('select')
      .clear('limit')
      .clear('offset');

    const fieldsList = args.orderBy
      ? Object.keys(args.orderBy).map(
          key => `qa.${
            classTransformerDefaultMetadataStorage.findExposeMetadata(
              QuizAnswer,
              key,
            )?.options?.name || key }`,
        )
      : ['qa.id']; // Select id field if no orderBy is provided

    qb.select(fieldsList);

    return qb;
  }

  createQueryBuilder(
    args: QuizAnswerArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ qa: 'studihub.quiz_answers' });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('qa.id', args.where?.id);
    }

    if (args.where?.questionId) {
      qb.andWhere('qa.question_id', args.where?.questionId);
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
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            QuizAnswer,
            key,
          )?.options?.name || key,
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
}
