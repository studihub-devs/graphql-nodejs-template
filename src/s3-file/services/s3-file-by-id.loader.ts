import DataLoader from 'dataloader';
import hash from 'object-hash';
import { plainToClass } from 'class-transformer';

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import { S3File } from '../entities/s3-file.entity';
import knex from '../../knex';

export type S3FileLoader = DataLoader<SelectLoaderKey<number>, S3File, string>;
export const createS3FileLoader = (): S3FileLoader =>
  new DataLoader<SelectLoaderKey<number>, S3File, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .select(...keys[0].fields)
        .from('studihub.s3_file')
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(S3File, row)));
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
