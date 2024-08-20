import { ArgsType, Field, Int } from 'type-graphql';

import { PaginationArgs } from '../../../shared/types/pagination.args';
import { ResourceOrderByInput } from './resource-order.input';
import { ResourceWhereInput } from './resource-where.input';

@ArgsType()
export class ResourcesArgs extends PaginationArgs {
  @Field(() => ResourceOrderByInput, { nullable: true })
  orderBy?: ResourceOrderByInput;

  @Field(() => ResourceWhereInput, { nullable: true })
  where?: ResourceWhereInput;
}
