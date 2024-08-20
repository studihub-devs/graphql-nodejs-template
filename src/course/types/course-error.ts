import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { CourseErrorCode } from './course-error-code';

@ObjectType({ implements: Error })
export class CourseError implements Error {
  constructor(options: Partial<CourseError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => CourseErrorCode)
  code: CourseErrorCode;
}
