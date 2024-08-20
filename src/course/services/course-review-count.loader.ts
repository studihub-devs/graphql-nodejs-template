import DataLoader from 'dataloader';
import knex from '../../knex';
import { Course } from '../entities/course.entity';

export type CourseReviewCountLoaderKey = {
  courseId: Course['id'];
};

export type CourseReviewCountLoader = DataLoader<
  CourseReviewCountLoaderKey,
  number,
  string
>;

export const createCourseReviewCountLoader = (): CourseReviewCountLoader =>
  new DataLoader<CourseReviewCountLoaderKey, number, string>(
    async keys => {
      const ids = keys.map(key => key.courseId);
      const rows = await knex('studihub.course_review')
        .select('course_id')
        .count('* as review_count')
        .whereIn('course_id', ids)
        .groupBy('course_id');

      const reviewCountMap = new Map<number, number>(
        rows.map(row => [row.course_id, parseInt(row.review_count, 10)]),
      );

      return ids.map(id => reviewCountMap.get(id) || 0);
    },
    {
      cacheKeyFn: key => `${key.courseId}`,
    },
  );
