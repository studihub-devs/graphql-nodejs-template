import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { CourseReviewOrderByInput } from './course-review-order-by.input';
import { CourseReviewWhereInput } from './course-review-where.input';

@ArgsType()
export class CourseReviewArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: CourseReviewWhereInput;

  @Field(() => CourseReviewOrderByInput, { nullable: true })
  orderBy?: CourseReviewOrderByInput;
}
