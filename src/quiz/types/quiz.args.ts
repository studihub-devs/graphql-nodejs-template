import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { QuizOrderByInput } from './quiz-order-by.input';
import { QuizWhereInput } from './quiz-where.input';

@ArgsType()
export class QuizArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: QuizWhereInput;

  @Field(() => QuizOrderByInput, { nullable: true })
  orderBy?: QuizOrderByInput;
}
