import { registerEnumType } from 'type-graphql';

export enum CourseContentErrorCode {
  CAN_NOT_MUTATE_COURSE_CONTENT = 'CAN_NOT_MUTATE_COURSE_CONTENT',
}

registerEnumType(CourseContentErrorCode, {
  name: 'CourseContentErrorCode',
});
