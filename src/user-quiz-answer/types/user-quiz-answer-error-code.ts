import { registerEnumType } from 'type-graphql';

export enum UserQuizAnswerErrorCode {  
  QUIZ_NOT_PUBLIC = 'QUIZ_NOT_PUBLIC',
}

registerEnumType(UserQuizAnswerErrorCode, {
  name: 'UserQuizAnswerErrorCode',
});
