import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { CourseCategoryOrderByInput } from './course-category-order-by.input';
import { CourseCategoryWhereInput } from './course-category-where.input';

@ArgsType()
export class CourseCategoryArgs extends PaginationArgs {
  @Field(() => CourseCategoryWhereInput, { nullable: true })
  where?: CourseCategoryWhereInput;

  @Field(() => CourseCategoryOrderByInput, { nullable: true })
  orderBy?: CourseCategoryOrderByInput;
}
