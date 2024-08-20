import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class RoleResourceWhereUniqueInput {
  @Field(() => Int, { nullable: true })
  resourceId?: number[];

  @Field(() => Int, { nullable: true })
  roleId?: number;
}
