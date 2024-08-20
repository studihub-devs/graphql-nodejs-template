import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { UserQuizAnswer } from '../entities/user-quiz-answer.entity';

export type UserQuizAnswerLoader = DataLoader<SelectLoaderKey<number>, UserQuizAnswer, string>;

export const createUserQuizAnswerLoader = (): UserQuizAnswerLoader =>
  new DataLoader<SelectLoaderKey<number>, UserQuizAnswer, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .from('studihub.user_quiz_answer')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(UserQuizAnswer, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
