import { registerEnumType } from 'type-graphql';

export enum CourseViewershipErrorCode {
  COURSE_NOT_PUBLIC = 'COURSE_NOT_PUBLIC',
}

registerEnumType(CourseViewershipErrorCode, {
  name: 'CourseViewershipErrorCode',
});
