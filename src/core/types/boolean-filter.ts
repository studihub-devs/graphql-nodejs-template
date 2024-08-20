import { Field, InputType } from 'type-graphql';

@InputType()
export class BooleanFilter {
  @Field({ nullable: true })
  equals?: boolean;

  @Field({ nullable: true })
  not?: boolean;
}
