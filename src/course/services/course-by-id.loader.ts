import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { Course } from '../entities/course.entity';

export type CourseLoader = DataLoader<SelectLoaderKey<number>, Course, string>;

export const createCourseLoader = (): CourseLoader =>
  new DataLoader<SelectLoaderKey<number>, Course, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .from('studihub.course')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(Course, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
