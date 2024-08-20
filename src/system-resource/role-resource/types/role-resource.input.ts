import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class RoleResourceDataInput {
  @Field(() => Int, { nullable: true })
  resourceId?: number;

  @Field(() => Boolean, { nullable: true })
  status?: boolean;
}
