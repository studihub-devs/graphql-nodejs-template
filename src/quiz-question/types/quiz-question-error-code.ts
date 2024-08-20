import { registerEnumType } from 'type-graphql';

export enum QuizQuestionErrorCode {
  CAN_NOT_MUTATE_QUIZ_QUESTION = 'CAN_NOT_MUTATE_QUIZ_QUESTION',
}

registerEnumType(QuizQuestionErrorCode, {
  name: 'QuizQuestionErrorCode',
});
