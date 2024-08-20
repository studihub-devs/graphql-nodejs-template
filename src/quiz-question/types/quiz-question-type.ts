import { registerEnumType } from 'type-graphql';

export enum QuizQuestionType {
  SINGLE = 'single choise',
  MULTIPLE = 'multiple choise',
}

registerEnumType(QuizQuestionType, {
  name: 'QuizQuestionType',
});
