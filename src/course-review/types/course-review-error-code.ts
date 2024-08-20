import { registerEnumType } from 'type-graphql';

export enum CourseReviewErrorCode {
  COURSE_NOT_PUBLIC = 'COURSE_NOT_PUBLIC',
}

registerEnumType(CourseReviewErrorCode, {
  name: 'CourseReviewErrorCode',
});
