import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UserQuizAnswerWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  userQuizId?: number;

  @Field(() => Int, { nullable: true })
  roleId?: number;
}
