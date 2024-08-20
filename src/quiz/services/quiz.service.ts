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
import { Quiz } from '../entities/quiz.entity';
import { QuizWhereInput } from '../types/quiz-where.input';
import { QuizArgs } from '../types/quiz.args';
import { QuizRelayConnection } from '../types/quiz.relay-connection';
import { OrderBy } from '../../shared/types/order-by';
import { encodeCursor, paginate } from '../../utils/cursor-buffer';
import { UpdateQuizInput } from '../types/update-quiz.input';
import { QuizOrError } from '../types/quiz-or-error';
import { QuizError } from '../types/quiz-error';
import { QuizErrorCode } from '../types/quiz-error-code';
import { ErrorStatus } from '../../core/types/error-status';
import { ErrorFactory } from '../../core/services/error-factory';
import { InsertQuizInput } from '../types/insert-quiz.input';
import { QuizStatus } from '../types/quiz-status';

@injectable()
export class QuizService extends BaseService<Quiz> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = Quiz;
    this.transformFields = {
      questions: 'id',
    };
  }

  async getOne(where: QuizWhereInput, info: GraphQLResolveInfo): Promise<Quiz> {
    return knex
      .from('studihub.quiz')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(Quiz, row));
  }

  async getMany(
    args: QuizArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<Quiz[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(Quiz, row)),
    );
  }

  async getManyRelay(
    args: QuizArgs,
    ctx?: Context,
  ): Promise<QuizRelayConnection> {
    const totalCount = await this.getCount(args);

    // Set a default orderBy if not provided, to ensure proper sorting
    if (!args.after && !args.before && !args.orderBy) {
      args.orderBy = { id: OrderBy.ASC }; // Default ordering by 'id'
    }

    const quizzes = await this.createQueryBuilderCursor(args, ctx).then(rows =>
      rows.map(row => plainToClass(Quiz, row)),
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

    return plainToClass(QuizRelayConnection, {
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


  async getCount(args: QuizArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilderCursor(args: QuizArgs, ctx?: Context): Knex.QueryBuilder {
    const qb = this.createQueryBuilder(args)
      .clear('select')
      .clear('limit')
      .clear('offset');

    const fieldsList = args.orderBy
      ? Object.keys(args.orderBy).map(
          key => `q.${
            classTransformerDefaultMetadataStorage.findExposeMetadata(
              Quiz,
              key,
            )?.options?.name || key }`,
        )
      : ['q.id']; // Select id field if no orderBy is provided

    qb.select(fieldsList);

    return qb;
  }

  createQueryBuilder(
    args: QuizArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ q: 'studihub.quiz' });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('q.id', args.where?.id);
    }

    if (args.where?.courseContentId) {
      qb.andWhere('q.course_content_id', args.where?.courseContentId);
    }

    if (args.where?.userId) {
      switch (args.where?.roleId.toString()) {
        case process.env.TEACHER_ROLE:
          qb.innerJoin({ cc: 'studihub.course_content' }, 'q.course_content_id', 'cc.id')
          .innerJoin({ c: 'studihub.course' }, 'c.id', 'cc.course_id')
          .andWhere(function() {
            this.orWhereRaw(`(c.teacher_id = ${args.where?.userId} and q.status is not null)`).orWhereRaw(
              `(c.teacher_id != ${args.where?.userId} and q.status = '${QuizStatus.APPROVED}')`,
            );
          });
          break;
        case process.env.ADMIN_ROLE:
          break;
        default:
          qb.andWhere('q.status', QuizStatus.APPROVED);
          break;
      }
    } else {
      qb.andWhere('q.status', QuizStatus.APPROVED);
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
        qb.orderBy(`q.${
          classTransformerDefaultMetadataStorage.findExposeMetadata(Quiz, key)
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

  async mutateStatus(
    data: UpdateQuizInput,
    where: QuizWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof QuizOrError> {
    if (ctx.user?.roleId.toString() != process.env.ADMIN_ROLE) {
      return new QuizError({
        message: 'You can not mutate this course',
        code: QuizErrorCode.CAN_NOT_MUTATE_QUIZ,
        status: ErrorStatus.FORBIDDEN,
      });
    }
    return writer.transaction(async trx => {
      const result = await trx
        .from('studihub.quiz')
        .update({
          status: data.status,
          updated_at: new Date(),
        })
        .where('id', where.id)
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(Quiz, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });
      return result;
    });
  }

  async delete(
    where: QuizWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof QuizOrError> {
    return writer.transaction(async trx => {       
      const quiz = await trx
        .from('studihub.quiz')
        .where('id', where.id)
        .del()
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(Quiz, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });

      return quiz;
    });
  }

  async update(
    data: UpdateQuizInput,
    where: QuizWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof QuizOrError> {
    return writer.transaction(async trx => {      
      const quiz = await trx
        .from('studihub.quiz')
        .update({
          name: data.name,         
          duration: data.duration,
          from_time: data.fromTime,
          to_time: data.toTime,
          updated_at: new Date(),
        })
        .where('id', where?.id)
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(Quiz, rows[0]));
      return quiz;
    });
  }

  async create(
    data: InsertQuizInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof QuizOrError> {
    return writer
      .transaction(async trx => {
        const quiz = await trx
          .from('studihub.quiz')
          .insert({
            name: data.name,
            course_content_id: data.courseContentId,
            duration: data.duration,
            from_time: data.fromTime,
            to_time: data.toTime,
            status: QuizStatus.CREATED,             
          })
          .returning(this.getFieldList(info))
          .then(rows => plainToClass(Quiz, rows[0]));

        return quiz;
      })
      .catch(e => {
        throw ErrorFactory.createInternalServerError();
      });
  }
}
