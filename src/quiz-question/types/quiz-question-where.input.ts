import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class QuizQuestionWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  quizId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  roleId?: number;
}
