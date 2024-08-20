import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class QuizWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  courseContentId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  roleId?: number;
}
