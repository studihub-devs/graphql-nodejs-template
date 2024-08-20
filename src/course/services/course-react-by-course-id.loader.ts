import { plainToClass } from 'class-transformer';
import DataLoader from 'dataloader';
import hash from 'object-hash';
import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import { CourseReact } from '../../course-react/entities/course-react.entity';
import knex from '../../knex';
import { Course } from '../entities/course.entity';

export type CourseReactByCourseIdLoaderKey = SelectLoaderKey<Course['id']>;
export type CourseReactByCourseIdLoader = DataLoader<
  CourseReactByCourseIdLoaderKey,
  CourseReact[],
  string
>;

export const createCourseReactByCourseIdLoader = (): CourseReactByCourseIdLoader =>
  new DataLoader<CourseReactByCourseIdLoaderKey, CourseReact[], string>(
    async keys => {
      const ids = keys.map(key => key.id);
      const rows = await knex
        .from({ c: 'studihub.course' })
        .joinRaw(
          `LEFT JOIN LATERAL (${knex
            .from({
              cc: 'studihub.course_react',
            })
            .select(keys[0].fields)
            .where({
              'cc.course_id': knex.ref('c.id'),
            })
            .toQuery()}) AS cc ON true`,
        )
        .select('c.id', knex.raw('JSON_AGG(cc) AS reacts'))
        .whereIn('c.id', ids)
        .groupBy('c.id')
        .orderByRaw(`idx(array[${ids}], c.id)`);

      return rows.map(
        row =>
          row.reacts
            ?.filter(c => !!c)
            ?.map(c => plainToClass(CourseReact, c)) || [],
      );
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
