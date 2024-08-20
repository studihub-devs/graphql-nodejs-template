import { ArgsType, Field, ID, Int } from 'type-graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => ID, { nullable: true })
  after?: string;

  @Field(() => ID, { nullable: true })
  before?: string;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  first?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  last?: number;
}
