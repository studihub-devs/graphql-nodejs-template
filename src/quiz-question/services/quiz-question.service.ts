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
import { QuizQuestion } from '../entities/quiz-question.entity';
import { QuizQuestionWhereInput } from '../types/quiz-question-where.input';
import { QuizQuestionArgs } from '../types/quiz-question.args';
import { QuizQuestionRelayConnection } from '../types/quiz-question.relay-connection';
import { OrderBy } from '../../shared/types/order-by';
import { encodeCursor, paginate } from '../../utils/cursor-buffer';
import { QuizStatus } from '../../quiz/types/quiz-status';
import { QuizQuestionOrError } from '../types/quiz-question-or-error';
import { ErrorFactory } from '../../core/services/error-factory';
import { UpdateQuizQuestionInput } from '../types/update-quiz-question.input';
import { InsertQuizQuestionInput } from '../types/insert-quiz-question.input';
import { UpdateQuizQuestionSeqInput } from '../types/update-quiz-question-seq.input';

@injectable()
export class QuizQuestionService extends BaseService<QuizQuestion> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = QuizQuestion;
    this.transformFields = {
      answers: 'id',
    };
  }

  async getOne(
    where: QuizQuestionWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<QuizQuestion> {
    return knex
      .from('studihub.quiz_questions')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(QuizQuestion, row));
  }

  async getMany(
    args: QuizQuestionArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<QuizQuestion[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(QuizQuestion, row)),
    );
  }

  async getManyRelay(
    args: QuizQuestionArgs,
    ctx?: Context,
  ): Promise<QuizQuestionRelayConnection> {
    const totalCount = await this.getCount(args);

    // Set a default orderBy if not provided, to ensure proper sorting
    if (!args.after && !args.before && !args.orderBy) {
      args.orderBy = { id: OrderBy.ASC }; // Default ordering by 'id'
    }

    const quizQuestions = await this.createQueryBuilderCursor(args, ctx).then(rows =>
      rows.map(row => plainToClass(QuizQuestion, row)),
    );

    const paginatedCourses = paginate(
      quizQuestions,
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

    return plainToClass(QuizQuestionRelayConnection, {
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


  async getCount(args: QuizQuestionArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilderCursor(args: QuizQuestionArgs, ctx?: Context): Knex.QueryBuilder {
    const qb = this.createQueryBuilder(args)
      .clear('select')
      .clear('limit')
      .clear('offset');

    const fieldsList = args.orderBy
      ? Object.keys(args.orderBy).map(
          key => `qq.${
            classTransformerDefaultMetadataStorage.findExposeMetadata(
              QuizQuestion,
              key,
            )?.options?.name || key }`,
        )
      : ['qq.id']; // Select id field if no orderBy is provided

    qb.select(fieldsList);

    return qb;
  }

  createQueryBuilder(
    args: QuizQuestionArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ qq: 'studihub.quiz_questions' });
    qb.innerJoin({ q: 'studihub.quiz'}, 'q.id', 'qq.quiz_id')

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('qq.id', args.where?.id);
    }

    if (args.where?.quizId) {
      qb.andWhere('qq.quiz_id', args.where?.quizId);
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
        qb.orderBy(`qq.${
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            QuizQuestion,
            key,
          )?.options?.name || key }`,
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

  async mutateSeq(
    data: UpdateQuizQuestionSeqInput[],    
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise< typeof QuizQuestionOrError> {
    return writer.transaction(async trx => { 
      const queries = [];
      data.map(dt => {
        const query = knex.from('studihub.quiz_questions')
            .where('id', dt.questionId)
            .update({
              seq_id: dt.seqId,
              updated_at: new Date(), 
            })
            .returning(this.getFieldList(info))           
            .transacting(trx); 
        queries.push(query);
      });

      return Promise.all(queries) 
        .then(rows => plainToClass(QuizQuestion, rows[0][0]))        
        .catch(e => {         
          throw ErrorFactory.createInternalServerError();
        });      
    });
  }

  async delete(
    where: QuizQuestionWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof QuizQuestionOrError> {
    return writer.transaction(async trx => {       
      const quizQuestion = await trx
        .from('studihub.quiz_questions')
        .where('id', where.id)
        .del()
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(QuizQuestion, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });

      await trx
        .from('studihub.quiz_answers')
        .where('question_id', where.id)
        .del()

      return quizQuestion;
    });
  }

  async update(
    data: UpdateQuizQuestionInput,
    where: QuizQuestionWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof QuizQuestionOrError> {
    return writer.transaction(async trx => {      
      const quizQuestion = await trx
        .from('studihub.quiz_questions')
        .update({
          content: data.content,         
          seq_id: data.seqId,
          type: data.type,
          updated_at: new Date(),
        })
        .where('id', where?.id)
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(QuizQuestion, rows[0]));

      if(data?.answers?.length > 0) {
        await trx
          .from('studihub.quiz_answers')
          .insert(
            data.answers.map(a => ({
              id: a.id,
              content: a.content,
              seq_id: a.seqId,
              is_correct: a.isCorrect,
            }))
          )
          .transacting(trx)
          .onConflict('id')
          .merge()
      }

      return quizQuestion;
    });
  }

  async create(
    data: InsertQuizQuestionInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof QuizQuestionOrError> {
    return writer
      .transaction(async trx => {
        const quizQuestion = await trx
          .from('studihub.quiz_questions')
          .insert({
            content: data.content,  
            quiz_id: data.quizId,       
            seq_id: data.seqId,
            type: data.type,            
          })
          .returning(this.getFieldList(info))
          .then(rows => plainToClass(QuizQuestion, rows[0]));       

        if(data?.answers?.length > 0) {
          await trx
            .from('studihub.quiz_answers')
            .insert(
              data.answers.map(a => ({
                id: a.id,
                content: a.content,
                question_id: quizQuestion?.id,
                seq_id: a.seqId,
                is_correct: a.isCorrect,
              }))
            )
            .transacting(trx)
            .onConflict('id')
            .merge()
        }

        return quizQuestion;
      })
      .catch(e => {
        throw ErrorFactory.createInternalServerError();
      });
  }
}
