import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { CourseContentErrorCode } from './course-content-error-code';

@ObjectType({ implements: Error })
export class CourseContentError implements Error {
  constructor(options: Partial<CourseContentError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => CourseContentErrorCode)
  code: CourseContentErrorCode;
}
