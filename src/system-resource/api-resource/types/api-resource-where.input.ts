import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class APIResourceWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  resourceId?: number;

  @Field({ nullable: true })
  text?: string;
}
