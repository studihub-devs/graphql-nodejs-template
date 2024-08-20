import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { CourseContent } from '../entities/course-content.entity';
import { CourseContentError } from './course-content-error';

export const CourseContentOrError = createUnionType({
  name: 'CourseContentOrError',
  types: () => [CourseContent, CourseContentError, CommonError],
});
