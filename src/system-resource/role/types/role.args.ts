import { ArgsType, Field } from 'type-graphql';

import { RolesOrderByInput } from './role-order-by.input';
import { RolesWhereInput } from './role-where.input';
import { PaginationArgs } from '../../../shared/types/pagination.args';

@ArgsType()
export class RolesArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: RolesWhereInput;

  @Field(() => RolesOrderByInput, { nullable: true })
  orderBy?: RolesOrderByInput;
}
