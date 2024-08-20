import DataLoader from 'dataloader';
import hash from 'object-hash';
import knex from '../../knex';
import { Course } from '../entities/course.entity';

export type AverageRatingByCourseIdLoaderKey = {
  id: Course['id'];
};

export type AverageRatingByCourseIdLoader = DataLoader<
  AverageRatingByCourseIdLoaderKey,
  number,
  string
>;

export const createAverageRatingByCourseIdLoader = (): AverageRatingByCourseIdLoader =>
  new DataLoader<AverageRatingByCourseIdLoaderKey, number, string>(
    async keys => {
      const ids = keys.map(key => key.id);
      const rows = await knex('studihub.course_review')
        .select('course_id')
        .avg('rate as averageRating')
        .whereIn('course_id', ids)
        .groupBy('course_id')
        .orderByRaw(`idx(array[${ids}], course_id)`);

      const averageRatingsMap = new Map<number, number>(
        rows.map(row => [row.course_id, parseFloat(row.averageRating)]),
      );

      return ids.map(id => averageRatingsMap.get(id) || 0);
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
