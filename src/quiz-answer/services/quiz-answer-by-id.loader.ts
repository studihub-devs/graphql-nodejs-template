import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { QuizAnswer } from '../entities/quiz-answer.entity';

export type QuizAnswerLoader = DataLoader<SelectLoaderKey<number>, QuizAnswer, string>;

export const createQuizAnswerLoader = (): QuizAnswerLoader =>
  new DataLoader<SelectLoaderKey<number>, QuizAnswer, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .from('studihub.quiz_answers')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(QuizAnswer, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
