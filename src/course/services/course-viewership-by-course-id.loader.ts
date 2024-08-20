import { plainToClass } from 'class-transformer';
import DataLoader from 'dataloader';
import hash from 'object-hash';
import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import { CourseViewership } from '../../course-viewership/entities/course-viewership.entity';
import knex from '../../knex';
import { Course } from '../entities/course.entity';

export type CourseViewershipByCourseIdLoaderKey = SelectLoaderKey<Course['id']>;
export type CourseViewershipByCourseIdLoader = DataLoader<
  CourseViewershipByCourseIdLoaderKey,
  CourseViewership[],
  string
>;

export const createCourseViewershipByCourseIdLoader = (): CourseViewershipByCourseIdLoader =>
  new DataLoader<
    CourseViewershipByCourseIdLoaderKey,
    CourseViewership[],
    string
  >(
    async keys => {
      const ids = keys.map(key => key.id);
      const rows = await knex
        .from({ c: 'studihub.course' })
        .joinRaw(
          `LEFT JOIN LATERAL (${knex
            .from({
              cc: 'studihub.course_viewership',
            })
            .select(keys[0].fields)
            .where({
              'cc.course_id': knex.ref('c.id'),
            })
            .toQuery()}) AS cc ON true`,
        )
        .select('c.id', knex.raw('JSON_AGG(cc) AS viewerships'))
        .whereIn('c.id', ids)
        .groupBy('c.id')
        .orderByRaw(`idx(array[${ids}], c.id)`);

      return rows.map(
        row =>
          row.viewerships
            ?.filter(c => !!c)
            ?.map(c => plainToClass(CourseViewership, c)) || [],
      );
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
