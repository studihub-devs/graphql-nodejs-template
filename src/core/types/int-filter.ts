import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class IntFilter {
  @Field(() => Int, { nullable: true })
  equals?: number;

  @Field(() => Int, { nullable: true })
  ne?: number;

  @Field(() => [Int], { nullable: true })
  in?: number[];

  @Field(() => [Int], { nullable: true })
  notIn?: number[];

  @Field(() => Int, { nullable: true })
  lt?: number;

  @Field(() => Int, { nullable: true })
  lte?: number;

  @Field(() => Int, { nullable: true })
  gt?: number;

  @Field(() => Int, { nullable: true })
  gte?: number;
}
