import { plainToClass } from 'class-transformer';
import DataLoader = require('dataloader');

import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { CourseContent } from '../entities/course-content.entity';

export type CourseContentLoader = DataLoader<SelectLoaderKey<number>, CourseContent, string>;

export const createCourseContentLoader = (): CourseContentLoader =>
  new DataLoader<SelectLoaderKey<number>, CourseContent, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      return knex
        .from('studihub.course_content')
        .select(...keys[0].fields)
        .whereIn('id', ids)
        .orderByRaw(`idx(array[${ids}], id)`)
        .then(rows => rows.map(row => plainToClass(CourseContent, row)));
    },
    {
      cacheKeyFn: (key): string => key.id.toString(),
    },
  );
