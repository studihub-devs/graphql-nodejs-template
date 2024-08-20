import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { UserQuizAnswerOrderByInput } from './user-quiz-answer-order-by.input';
import { UserQuizAnswerWhereInput } from './user-quiz-answer-where.input';

@ArgsType()
export class UserQuizAnswerArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: UserQuizAnswerWhereInput;

  @Field(() => UserQuizAnswerOrderByInput, { nullable: true })
  orderBy?: UserQuizAnswerOrderByInput;
}
