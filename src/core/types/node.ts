import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Node {
  @Field(() => ID)
  id: number;
}
