import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { CourseViewership } from '../entities/course-viewership.entity';
import { CourseViewershipError } from './course-viewership-error';

export const CourseViewershipOrError = createUnionType({
  name: 'CourseViewershipOrError',
  types: () => [CourseViewership, CourseViewershipError, CommonError],
});
