import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../../shared/types/pagination.args';
import { APIResourceOrderByInput } from './api-resource-order.input';
import { APIResourceWhereInput } from './api-resource-where.input';

@ArgsType()
export class APIResourceArgs extends PaginationArgs {
  @Field(() => APIResourceOrderByInput, { nullable: true })
  orderBy?: APIResourceOrderByInput;

  @Field(() => APIResourceWhereInput, { nullable: true })
  where?: APIResourceWhereInput;
}
