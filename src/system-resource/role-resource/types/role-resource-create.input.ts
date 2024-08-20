import { Field, InputType, Int } from 'type-graphql';
import { RoleResourceDataInput } from './role-resource.input';

@InputType()
export class RoleResourceCreateInput {
  @Field(() => Int, { nullable: true })
  roleId?: number;

  @Field(() => [RoleResourceDataInput])
  roleResourceData?: RoleResourceDataInput[];
}
