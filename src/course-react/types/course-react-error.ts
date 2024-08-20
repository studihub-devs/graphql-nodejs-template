import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { CourseReactErrorCode } from './course-react-error-code';

@ObjectType({ implements: Error })
export class CourseReactError implements Error {
  constructor(options: Partial<CourseReactError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => CourseReactErrorCode)
  code: CourseReactErrorCode;
}
