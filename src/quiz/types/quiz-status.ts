import { registerEnumType } from 'type-graphql';

export enum QuizStatus {
  CREATED = 'created',
  APPROVED = 'approved',
  BLOCKED = 'blocked',
}

registerEnumType(QuizStatus, {
  name: 'QuizStatus',
});
