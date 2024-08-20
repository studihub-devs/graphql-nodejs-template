import { Field, ID, InputType, Int } from 'type-graphql';

@InputType()
export class ResourceInput {
  @Field(() => Int)
  id: number;

  @Field(() => Boolean)
  status: boolean;
}
