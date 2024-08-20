import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class EdgeBase {
  @Field(() => ID, { nullable: true })
  cursor?: string;
}
