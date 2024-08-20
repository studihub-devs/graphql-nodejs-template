import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class InsertUserQuizInput {
  @Field()
  quizId: number;
}
