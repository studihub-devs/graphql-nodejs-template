import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { QuizQuestionOrderByInput } from './quiz-question-order-by.input';
import { QuizQuestionWhereInput } from './quiz-question-where.input';

@ArgsType()
export class QuizQuestionArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: QuizQuestionWhereInput;

  @Field(() => QuizQuestionOrderByInput, { nullable: true })
  orderBy?: QuizQuestionOrderByInput;
}
