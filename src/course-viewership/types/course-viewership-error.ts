import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { CourseViewershipErrorCode } from './course-viewership-error-code';

@ObjectType({ implements: Error })
export class CourseViewershipError implements Error {
  constructor(options: Partial<CourseViewershipError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => CourseViewershipErrorCode)
  code: CourseViewershipErrorCode;
}
