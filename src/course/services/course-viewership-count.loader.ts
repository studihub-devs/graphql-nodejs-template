import DataLoader from 'dataloader';
import knex from '../../knex';
import { Course } from '../entities/course.entity';

export type CourseViewershipCountLoaderKey = {
  courseId: Course['id'];
};

export type CourseViewershipCountLoader = DataLoader<
  CourseViewershipCountLoaderKey,
  number,
  string
>;

export const createCourseViewershipCountLoader = (): CourseViewershipCountLoader =>
  new DataLoader<CourseViewershipCountLoaderKey, number, string>(
    async keys => {
      const ids = keys.map(key => key.courseId);
      const rows = await knex('studihub.course_viewership')
        .select('course_id')
        .count('* as viewership_count')
        .whereIn('course_id', ids)
        .groupBy('course_id');

      const viewershipCountMap = new Map<number, number>(
        rows.map(row => [row.course_id, parseInt(row.viewership_count, 10)]),
      );

      return ids.map(id => viewershipCountMap.get(id) || 0);
    },
    {
      cacheKeyFn: key => `${key.courseId}`,
    },
  );
