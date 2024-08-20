import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { CourseReview } from '../entities/course-review.entity';
import { CourseReviewError } from './course-review-error';

export const CourseReviewOrError = createUnionType({
  name: 'CourseReviewOrError',
  types: () => [CourseReview, CourseReviewError, CommonError],
});
