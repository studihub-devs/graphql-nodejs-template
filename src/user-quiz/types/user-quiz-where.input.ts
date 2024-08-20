import { Field, InputType, Int } from 'type-graphql';
import { UserQuizStatus } from './user-quiz-status';

@InputType()
export class UserQuizWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  quizId?: number;

  @Field(() => UserQuizStatus, { nullable: true })
  statusFilter?: UserQuizStatus;

  @Field(() => Int, { nullable: true })
  roleId?: number;
}
