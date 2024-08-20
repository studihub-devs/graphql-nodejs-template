import { registerEnumType } from 'type-graphql';

export enum CourseReactErrorCode {
  COURSE_NOT_PUBLIC = 'COURSE_NOT_PUBLIC',
}

registerEnumType(CourseReactErrorCode, {
  name: 'CourseReactErrorCode',
});
