import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { UserCourse } from '../entities/user-course.entity';
import { UserCourseError } from './user-course-error';

export const UserCourseOrError = createUnionType({
  name: 'UserCourseOrError',
  types: () => [UserCourse, UserCourseError, CommonError],
});
