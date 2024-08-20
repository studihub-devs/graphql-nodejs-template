import { registerEnumType } from 'type-graphql';

export enum CourseType {
  MINI = 'Mini course',
  ADVANCE = 'Advanced course',
}

registerEnumType(CourseType, {
  name: 'CourseType',
});
