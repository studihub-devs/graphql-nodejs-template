import { registerEnumType } from 'type-graphql';

export enum CourseStatus {
  CREATED = 'created',
  APPROVED = 'approved',
  BLOCKED = 'blocked',
}

registerEnumType(CourseStatus, {
  name: 'CourseStatus',
});
