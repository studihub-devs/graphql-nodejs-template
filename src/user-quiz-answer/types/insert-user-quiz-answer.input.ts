import { InputType, Field } from 'type-graphql';
import { AnswerHistory } from './answer-history.input';

@InputType()
export class InsertUserQuizAnswerInput {
  @Field()
  userQuizId: number;

  @Field(() => [AnswerHistory])
  answerHistories: AnswerHistory[];
}
