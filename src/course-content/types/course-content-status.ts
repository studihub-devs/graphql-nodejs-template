import { registerEnumType } from 'type-graphql';

export enum CourseContentStatus {
  CREATED = 'created',
  APPROVED = 'approved',
  BLOCKED = 'blocked',
}

registerEnumType(CourseContentStatus, {
  name: 'CourseContentStatus',
});
