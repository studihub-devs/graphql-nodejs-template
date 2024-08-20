import { registerEnumType } from 'type-graphql';

export enum UserQuizStatus {
  STARTED = 'started',
  COMPLETED = 'completed'
}

registerEnumType(UserQuizStatus, {
  name: 'UserQuizStatus',
});
