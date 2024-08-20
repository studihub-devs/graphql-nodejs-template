import { registerEnumType } from 'type-graphql';

export enum UserCourseErrorCode {
  YOU_ALREADY_REGISTERED_THIS_COURSE = 'YOU_ALREADY_REGISTERED_THIS_COURSE',
  COURSE_NOT_PUBLIC = 'COURSE_NOT_PUBLIC',
}

registerEnumType(UserCourseErrorCode, {
  name: 'UserCourseErrorCode',
});
