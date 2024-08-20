import { registerEnumType } from 'type-graphql';

export enum CourseLevel {
  BEGINNER = 'beginner',
  ADVANCE = 'advance',
  ALL = 'all',
}

registerEnumType(CourseLevel, {
  name: 'CourseLevel',
});
