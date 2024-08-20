import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { QuizAnswerOrderByInput } from './quiz-answer-order-by.input';
import { QuizAnswerWhereInput } from './quiz-answer-where.input';

@ArgsType()
export class QuizAnswerArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: QuizAnswerWhereInput;

  @Field(() => QuizAnswerOrderByInput, { nullable: true })
  orderBy?: QuizAnswerOrderByInput;
}
