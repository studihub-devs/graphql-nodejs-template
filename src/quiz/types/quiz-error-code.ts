import { registerEnumType } from 'type-graphql';

export enum QuizErrorCode {
  CAN_NOT_MUTATE_QUIZ = 'CAN_NOT_MUTATE_QUIZ',
}

registerEnumType(QuizErrorCode, {
  name: 'QuizErrorCode',
});
