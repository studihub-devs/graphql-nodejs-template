import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { Quiz } from '../entities/quiz.entity';

export type QuizLoader = DataLoader<SelectLoaderKey<number>, Quiz, string>;

export const createQuizLoader = (): QuizLoader =>
  new DataLoader<SelectLoaderKey<number>, Quiz, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .from('studihub.quiz')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(Quiz, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
