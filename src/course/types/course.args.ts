import { ArgsType, Field } from 'type-graphql';
import { CourseWhereInput } from './course-where.input';
import { CourseOrderByInput } from './course-order-by.input';
import { PaginationArgs } from '../../shared/types/pagination.args';

@ArgsType()
export class CourseArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: CourseWhereInput;

  @Field(() => CourseOrderByInput, { nullable: true })
  orderBy?: CourseOrderByInput;
}
