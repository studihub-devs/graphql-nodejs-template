import { ArgsType, Field } from 'type-graphql';
import { RoleResourceOrderByInput } from './role-resource-order-by.input';
import { RoleResourceWhereUniqueInput } from './role-resource-where.input';
import { PaginationArgs } from '../../../shared/types/pagination.args';

@ArgsType()
export class RoleResourceArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: RoleResourceWhereUniqueInput;

  @Field(() => RoleResourceOrderByInput, { nullable: true })
  orderBy?: RoleResourceOrderByInput;
}
