import { plainToClass } from 'class-transformer';
import DataLoader from 'dataloader';
import hash from 'object-hash';
import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import { CourseReview } from '../../course-review/entities/course-review.entity';
import knex from '../../knex';
import { Course } from '../entities/course.entity';

export type CourseReviewByCourseIdLoaderKey = SelectLoaderKey<Course['id']>;
export type CourseReviewByCourseIdLoader = DataLoader<
  CourseReviewByCourseIdLoaderKey,
  CourseReview[],
  string
>;

export const createCourseReviewByCourseIdLoader = (): CourseReviewByCourseIdLoader =>
  new DataLoader<CourseReviewByCourseIdLoaderKey, CourseReview[], string>(
    async keys => {
      const ids = keys.map(key => key.id);
      const rows = await knex
        .from({ c: 'studihub.course' })
        .joinRaw(
          `LEFT JOIN LATERAL (${knex
            .from({
              cc: 'studihub.course_review',
            })
            .select(keys[0].fields)
            .where({
              'cc.course_id': knex.ref('c.id'),
            })
            .toQuery()}) AS cc ON true`,
        )
        .select('c.id', knex.raw('JSON_AGG(cc) AS reviews'))
        .whereIn('c.id', ids)
        .groupBy('c.id')
        .orderByRaw(`idx(array[${ids}], c.id)`);

      return rows.map(
        row =>
          row.reviews
            ?.filter(c => !!c)
            ?.map(c => plainToClass(CourseReview, c)) || [],
      );
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
