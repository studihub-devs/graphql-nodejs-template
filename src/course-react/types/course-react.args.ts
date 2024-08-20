import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { CourseReactOrderByInput } from './course-react-order-by.input';
import { CourseReactWhereInput } from './course-react-where.input';

@ArgsType()
export class CourseReactArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: CourseReactWhereInput;

  @Field(() => CourseReactOrderByInput, { nullable: true })
  orderBy?: CourseReactOrderByInput;
}
