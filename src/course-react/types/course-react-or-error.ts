import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { CourseReact } from '../entities/course-react.entity';
import { CourseReactError } from './course-react-error';

export const CourseReactOrError = createUnionType({
  name: 'CourseReactOrError',
  types: () => [CourseReact, CourseReactError, CommonError],
});
