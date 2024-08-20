import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { UserQuizOrderByInput } from './user-quiz-order-by.input';
import { UserQuizWhereInput } from './user-quiz-where.input';

@ArgsType()
export class UserQuizArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: UserQuizWhereInput;

  @Field(() => UserQuizOrderByInput, { nullable: true })
  orderBy?: UserQuizOrderByInput;
}
