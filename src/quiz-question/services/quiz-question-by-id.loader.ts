import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { QuizQuestion } from '../entities/quiz-question.entity';

export type QuizQuestionLoader = DataLoader<SelectLoaderKey<number>, QuizQuestion, string>;

export const createQuizQuestionLoader = (): QuizQuestionLoader =>
  new DataLoader<SelectLoaderKey<number>, QuizQuestion, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .from('studihub.quiz_questions')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(QuizQuestion, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
