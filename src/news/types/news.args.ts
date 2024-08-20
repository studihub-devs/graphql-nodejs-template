import { ArgsType, Field } from 'type-graphql';
import { NewsWhereInput } from './news-where.input';
import { NewsOrderByInput } from './news-order-by.input';
import { PaginationArgs } from '../../shared/types/pagination.args';

@ArgsType()
export class NewsArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: NewsWhereInput;

  @Field(() => NewsOrderByInput, { nullable: true })
  orderBy?: NewsOrderByInput;
}
