import { registerEnumType } from 'type-graphql';

export enum UserQuizErrorCode {
  YOU_ALREADY_STARTED_THIS_QUIZ = 'YOU_ALREADY_STARTED_THIS_QUIZ',
  QUIZ_NOT_PUBLIC = 'QUIZ_NOT_PUBLIC',
}

registerEnumType(UserQuizErrorCode, {
  name: 'UserQuizErrorCode',
});
