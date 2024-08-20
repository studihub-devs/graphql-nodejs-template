import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { CourseViewershipOrderByInput } from './course-viewership-order-by.input';
import { CourseViewershipWhereInput } from './course-viewership-where.input';

@ArgsType()
export class CourseViewershipArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: CourseViewershipWhereInput;

  @Field(() => CourseViewershipOrderByInput, { nullable: true })
  orderBy?: CourseViewershipOrderByInput;
}
