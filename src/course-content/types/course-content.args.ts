import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { CourseContentOrderByInput } from './course-content-order-by.input';
import { CourseContentWhereInput } from './course-content-where.input';

@ArgsType()
export class CourseContentArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: CourseContentWhereInput;

  @Field(() => CourseContentOrderByInput, { nullable: true })
  orderBy?: CourseContentOrderByInput;
}
