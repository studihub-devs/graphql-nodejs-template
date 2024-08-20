import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class QuizAnswerWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  questionId?: number;
}
