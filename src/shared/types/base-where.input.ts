import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class BaseWhereInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field(() => ID, { nullable: true })
  idNot?: number;

  @Field(() => [ID], { nullable: true })
  idIn?: Array<number>;

  @Field(() => [ID], { nullable: true })
  idNotIn?: Array<number>;

  @Field(() => ID, { nullable: true })
  idLt?: number;

  @Field(() => ID, { nullable: true })
  idLte?: number;

  @Field(() => ID, { nullable: true })
  idGt?: number;

  @Field(() => ID, { nullable: true })
  idGte?: number;
}
