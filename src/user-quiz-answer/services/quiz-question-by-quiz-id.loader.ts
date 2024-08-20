import DataLoader from 'dataloader';
import { plainToClass } from 'class-transformer';
import hash from 'object-hash';
import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { Quiz } from '../entities/quiz.entity';
import { QuizQuestion } from '../../quiz-question/entities/quiz-question.entity';
import { OrderBy } from '../../shared/types/order-by';

export type QuizQuestionByQuizIdLoaderKey = SelectLoaderKey<Quiz['id']>;
export type QuizQuestionByQuizIdLoader = DataLoader<
  QuizQuestionByQuizIdLoaderKey,
  QuizQuestion[],
  string
>;

export const createQuizQuestionByQuizIdLoader = (): QuizQuestionByQuizIdLoader =>
  new DataLoader<QuizQuestionByQuizIdLoaderKey, QuizQuestion[], string>(
    async keys => {
      const ids = keys.map(key => key.id);
      const rows = await knex
        .from({ q: 'studihub.quiz' })
        .joinRaw(
          `LEFT JOIN LATERAL (${knex
            .from({
              qq: 'studihub.quiz_questions',
            })
            .select(keys[0].fields)
            .where({
              'qq.quiz_id': knex.ref('q.id'),
            })
            .orderBy('qq.seq_id', OrderBy.ASC)
            .toQuery()}) AS qq ON true`,
        )
        .select('q.id', knex.raw('JSON_AGG(qq) AS questions'))
        .whereIn('q.id', ids)
        .groupBy('q.id')
        .orderByRaw(`idx(array[${ids}], q.id)`);
      return rows.map(
        row =>
          row.questions
            ?.filter(q => !!q)
            ?.map(q => plainToClass(QuizQuestion, q)) || [],
      );
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
