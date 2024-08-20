import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { CourseReviewErrorCode } from './course-review-error-code';

@ObjectType({ implements: Error })
export class CourseReviewError implements Error {
  constructor(options: Partial<CourseReviewError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => CourseReviewErrorCode)
  code: CourseReviewErrorCode;
}
