import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { Course } from '../entities/course.entity';
import { CourseError } from './course-error';

export const CourseOrError = createUnionType({
  name: 'CourseOrError',
  types: () => [Course, CourseError, CommonError],
});
