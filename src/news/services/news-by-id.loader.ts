import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { News } from '../entities/news.entity';

export type NewsLoader = DataLoader<SelectLoaderKey<number>, News, string>;

export const createNewsLoader = (): NewsLoader =>
  new DataLoader<SelectLoaderKey<number>, News, string>(
    async keys => {
      const ids = keys.map(key => key.id);

      return knex
        .from('studihub.news')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(News, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
