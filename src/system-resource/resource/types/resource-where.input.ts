import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class ResourceWhereInput {
  @Field({ nullable: true })
  text?: string;

  @Field(() => Int, { nullable: true })
  id?: number;
}
