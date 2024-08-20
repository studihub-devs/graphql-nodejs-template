import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { User } from '../entities/user.entity';

export type UserLoader = DataLoader<SelectLoaderKey<number>, User, string>;

export const createUserLoader = (): UserLoader =>
  new DataLoader<SelectLoaderKey<number>, User, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .from('studihub.user')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(User, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
