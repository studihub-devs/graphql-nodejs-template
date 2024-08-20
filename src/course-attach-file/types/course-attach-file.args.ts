import { ArgsType, Field } from 'type-graphql';
import { CourseAttachFileWhereInput } from './course-attach-file-where.input';
import { CourseAttachFileOrderByInput } from './course-attach-file-order-by.input';
import { PaginationArgs } from '../../shared/types/pagination.args';

@ArgsType()
export class CourseAttachFileArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: CourseAttachFileWhereInput;

  @Field(() => CourseAttachFileOrderByInput, { nullable: true })
  orderBy?: CourseAttachFileOrderByInput;
}
