import { registerEnumType } from 'type-graphql';

export enum CourseErrorCode {
  CAN_NOT_MUTATE_COURSE = 'CAN_NOT_MUTATE_COURSE',
}

registerEnumType(CourseErrorCode, {
  name: 'CourseErrorCode',
});
