import { Field, ObjectType } from 'type-graphql';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { UserCourseErrorCode } from './user-course-error-code';

@ObjectType({ implements: Error })
export class UserCourseError implements Error {
  constructor(options: Partial<UserCourseError>) {
    Object.assign(this, options);
  }

  @Field()
  message: string;

  status: ErrorStatus;

  @Field(() => UserCourseErrorCode)
  code: UserCourseErrorCode;
}
