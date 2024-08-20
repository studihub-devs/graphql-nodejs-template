import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');
import { SelectLoaderKey } from '../../../core/dataloader/select-loader-key';
import { Resource } from '../entities/resource.entity';
import knex from '../../../knex';

export type ResourceLoader = DataLoader<
  SelectLoaderKey<number>,
  Resource,
  string
>;

export const createResourceLoader = (): ResourceLoader =>
  new DataLoader<SelectLoaderKey<number>, Resource, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .from('studihub.resource')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(Resource, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
