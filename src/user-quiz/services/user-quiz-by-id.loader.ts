import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { UserQuiz } from '../entities/user-quiz.entity';

export type UserQuizLoader = DataLoader<SelectLoaderKey<number>, UserQuiz, string>;

export const createUserQuizLoader = (): UserQuizLoader =>
  new DataLoader<SelectLoaderKey<number>, UserQuiz, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .from('studihub.user_quiz_history')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(UserQuiz, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
