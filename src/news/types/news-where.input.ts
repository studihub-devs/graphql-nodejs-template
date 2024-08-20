import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class NewsWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;
}
