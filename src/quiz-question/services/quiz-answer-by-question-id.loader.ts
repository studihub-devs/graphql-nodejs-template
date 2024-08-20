import DataLoader from 'dataloader';
import { plainToClass } from 'class-transformer';
import hash from 'object-hash';
import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { QuizAnswer } from '../../quiz-answer/entities/quiz-answer.entity';
import { OrderBy } from '../../shared/types/order-by';

export type QuizAnswerByQuestionIdLoaderKey = SelectLoaderKey<
  QuizQuestion['id']
>;
export type QuizAnswerByQuestionIdLoader = DataLoader<
  QuizAnswerByQuestionIdLoaderKey,
  QuizAnswer[],
  string
>;

export const createQuizAnswerByQuestionIdLoader = (): QuizAnswerByQuestionIdLoader =>
  new DataLoader<QuizAnswerByQuestionIdLoaderKey, QuizAnswer[], string>(
    async keys => {
      const ids = keys.map(key => key.id);
      const rows = await knex
        .from({ qq: 'studihub.quiz_questions' })
        .joinRaw(
          `LEFT JOIN LATERAL (${knex
            .from({
              qa: 'studihub.quiz_answers',
            })
            .select(keys[0].fields)
            .where({
              'qa.question_id': knex.ref('qq.id'),
            })
            .orderBy('qa.seq_id', OrderBy.ASC)
            .toQuery()}) AS qa ON true`,
        )
        .select('qq.id', knex.raw('JSON_AGG(qa) AS answers'))
        .whereIn('qq.id', ids)
        .groupBy('qq.id')
        .orderByRaw(`idx(array[${ids}], qq.id)`);
      return rows.map(
        row =>
          row.answers
            ?.filter(a => !!a)
            ?.map(a => plainToClass(QuizAnswer, a)) || [],
      );
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
