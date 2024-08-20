import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class RolesWhereUniqueInput {
  @Field(() => Int)
  id: number;
}
