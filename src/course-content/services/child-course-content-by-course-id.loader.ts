import DataLoader from 'dataloader';
import { plainToClass } from 'class-transformer';
import hash from 'object-hash';
import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { CourseContent } from '../entities/course-content.entity';

export type ChildContentByCourseContentIdLoaderKey = SelectLoaderKey<
  CourseContent['id']
>;
export type ChildContentByCourseContentIdLoader = DataLoader<
  ChildContentByCourseContentIdLoaderKey,
  CourseContent[],
  string
>;

export const createChildContentByCourseContentIdLoader = (): ChildContentByCourseContentIdLoader =>
  new DataLoader<ChildContentByCourseContentIdLoaderKey, CourseContent[], string>(
    async keys => {
      const ids = keys.map(key => key.id);
      const rows = await knex
        .from({ cc: 'studihub.course_content' })
        .joinRaw(
          `LEFT JOIN LATERAL (${knex
            .from({
              c: 'studihub.course_content',
            })
            .select(keys[0].fields)
            .where({
              'c.parent_id': knex.ref('cc.id'),
            })
            .toQuery()}) AS c ON true`,
        )
        .select('cc.id', knex.raw('JSON_AGG(c) AS child'))
        .whereIn('cc.id', ids)
        .groupBy('cc.id')
        .orderByRaw(`idx(array[${ids}], cc.id)`);
      return rows.map(
        row =>
          row.child?.filter(f => !!f)?.map(f => plainToClass(CourseContent, f)) || [],
      );
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
