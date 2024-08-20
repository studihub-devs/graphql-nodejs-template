import DataLoader from 'dataloader';
import knex from '../../knex';
import { Course } from '../entities/course.entity';

export type CourseReactCountLoaderKey = {
  courseId: Course['id'];
};

export type CourseReactCountLoader = DataLoader<
  CourseReactCountLoaderKey,
  number,
  string
>;

export const createCourseReactCountLoader = (): CourseReactCountLoader =>
  new DataLoader<CourseReactCountLoaderKey, number, string>(
    async keys => {
      const ids = keys.map(key => key.courseId);
      const rows = await knex('studihub.course_react')
        .select('course_id')
        .count('* as react_count')
        .whereIn('course_id', ids)
        .groupBy('course_id');

      const reactCountMap = new Map<number, number>(
        rows.map(row => [row.course_id, parseInt(row.react_count, 10)]),
      );

      return ids.map(id => reactCountMap.get(id) || 0);
    },
    {
      cacheKeyFn: key => `${key.courseId}`,
    },
  );
